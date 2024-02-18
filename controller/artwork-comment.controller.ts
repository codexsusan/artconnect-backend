import { Request, Response } from "express";
import Comment from "../models/artwork-comment.model";
import Artwork from "../models/artworks.model";
import CommentLike from "../models/comment-like.model";
import User from "../models/user.model";
import { fetchNestedComments } from "../services/artwork-comment.services";
import {
  createNotification,
  notifyUsers,
} from "../services/notification.services";
import { NestedCommentInterface, NotificationMessageInterface } from "../types";
import "../utils/extended-express";

export const addComment = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const artworkId = req.params.artworkId;
    const content = req.body.content;

    const artwork = await Artwork.findById(artworkId);
    const fetchedUser = await User.findById(userId).select("username name");

    const authorUser = await User.findById(artwork.user).select("deviceToken");

    if (!artwork) {
      return res
        .status(404)
        .json({ message: "Artwork not found", success: false });
    }

    const comment = await Comment.create({
      user: userId,
      artworkId,
      content,
    });

    const notification: NotificationMessageInterface = {
      title: "Art Connect",
      body: `${fetchedUser?.name} has commented on your artwork.`,
      tokens: authorUser.deviceToken,
    };

    notifyUsers(notification);
    artwork.commentCount = (parseInt(artwork.commentCount) + 1).toString();
    await artwork.save();
    if (userId !== artwork.user) {
      await createNotification(
        artwork.user,
        notification.title,
        notification.body
      );
    }
    res
      .status(201)
      .json({ message: "Comment added", success: true, data: comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const addNestedComment = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const parentId = req.params.parentId;
    const artworkId = req.params.artworkId;

    const content = req.body.content;
    const artwork = await Artwork.findById(artworkId);

    const fetchedUser = await User.findById(userId).select("username name");

    if (!artwork) {
      return res
        .status(404)
        .json({ message: "Artwork not found", success: false });
    }

    let parentComment = null;
    if (parentId) {
      parentComment = await Comment.findOne({
        _id: parentId,
        artworkId,
      });
      if (!parentComment) {
        return res
          .status(404)
          .json({ message: "Parent comment not found", success: false });
      }
    }

    const authorUser = await User.findById(parentComment.user).select(
      "deviceToken"
    );

    const newComment = await Comment.create({
      user: userId,
      artworkId,
      content,
      parentId: parentId ?? "0",
    });

    const notification: NotificationMessageInterface = {
      title: "Art Connect",
      body: `${fetchedUser?.name} has replied to your comment.`,
      tokens: authorUser.deviceToken,
    };

    notifyUsers(notification);
    if (userId !== parentComment.user) {
      await createNotification(
        parentComment.user,
        notification.title,
        notification.body
      );
    }

    res.status(201).json({
      message: "Comment added",
      success: true,
      data: newComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const fetchAllComments = async (req: Request, res: Response) => {
  try {
    const artworkId: string = req.params.artworkId;
    const topLevelComments = await Comment.find({
      artworkId,
      parentId: "0",
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "username name profilePicture",
      });

    const nestedComments: NestedCommentInterface[] =
      [] as NestedCommentInterface[];
    for (let comment of topLevelComments) {
      const comments = await fetchNestedComments(comment._id);
      const currentComment = {
        _id: comment._id,
        user: comment.user,
        artworkId: comment.artworkId,
        content: comment.content,
        createdAt: comment.createdAt,
        children: comments,
      };
      nestedComments.push(currentComment);
    }
    res.status(200).json({
      message: "Fetched successfully.",
      success: true,
      data: nestedComments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const fetchTopLevelComments = async (req: Request, res: Response) => {
  try {
    const artworkId = req.params.artworkId;
    const topLevelComments = await Comment.find({
      artworkId,
      parentId: "0",
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "username name profilePicture",
      });

    res.status(200).json({
      message: "Fetched successfully.",
      success: true,
      data: topLevelComments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const switchCommentLike = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const commentId = req.params.commentId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found", success: false });
    }

    const userLike = await CommentLike.findOne({
      userId,
      commentId,
    });

    if (userLike) {
      await CommentLike.findByIdAndDelete(userLike._id);
      const likeCount = parseInt(comment.likeCount) - 1;
      comment.likeCount = likeCount.toString();
      await comment.save();
      res.status(200).json({ message: "Unliked", success: true });
    } else {
      await CommentLike.create({
        userId,
        commentId,
      });
      const likeCount = parseInt(comment.likeCount) + 1;
      comment.likeCount = likeCount.toString();
      await comment.save();
      res.status(200).json({ message: "Liked", success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};
