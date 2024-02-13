import { Request, Response } from "express";
import Comment from "../models/artwork-comment.model";
import Artwork from "../models/artworks.model";
import "../utils/extended-express";
import { fetchNestedComments } from "../services/artwork-comment.services";
import CommentLike from "../models/comment-like.model";
import { getUserById } from "../services/user.services";
import { NestedCommentInterface, NotificationMessageInterface } from "../types";
import { notifyUsers } from "../services/notification.services";

export const addComment = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const artworkId = req.params.artworkId;
    const content = req.body.content;

    const artwork = await Artwork.findById(artworkId).populate("userId");
    const fetchedUser = await getUserById(userId);

    if (!artwork) {
      return res
        .status(404)
        .json({ message: "Artwork not found", success: false });
    }

    const comment = await Comment.create({
      userId,
      artworkId,
      content,
    });

    const notification: NotificationMessageInterface = {
      title: "Art Connect",
      body: `${fetchedUser?.name} has commented on your artwork.`,
      tokens: [
        "fLoYl44LSC-0NY7oUA_GVy:APA91bEZrRbHtIg_KemkiFyjXhX9f9V-1h1cyl_7ps4duzeeG1kg3feRsSIs8wJCNQlfQr5zUyR3_smG2Dnl88bJhB1v_jTicl6FHKedTPh_m8FRPyadeoqxJR4fVIFNdKYuyBFLlaKa",
      ],
    };

    notifyUsers(notification);
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

    const newComment = await Comment.create({
      userId,
      artworkId,
      content,
      parentId: parentId ?? "0",
    });

    const notification: NotificationMessageInterface = {
      title: "Art Connect",
      body: ``,
      tokens: [""],
    };

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
    }).sort({ createdAt: -1 });

    const nestedComments: NestedCommentInterface[] =
      [] as NestedCommentInterface[];
    for (let comment of topLevelComments) {
      const comments = await fetchNestedComments(comment._id);
      const currentComment = {
        _id: comment._id,
        userId: comment.userId,
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
    }).sort({ createdAt: -1 });

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
