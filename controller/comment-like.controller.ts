import { Request, Response } from "express";
import Comment from "../models/artwork-comment.model";
import CommentLike from "../models/comment-like.model";
import "../utils/extended-express";
import { Types } from "mongoose";

export const switchCommentLike = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.userId;

    // Check if the comment exists
    const comment = await Comment.findById(new Types.ObjectId(commentId));
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found", success: false });
    }

    // Check if the user has already liked the comment
    const isLiked = await CommentLike.findOne({
      userId,
      commentId,
    });

    if (isLiked) {
      await CommentLike.deleteOne({ userId, commentId });
      comment.likeCount = String(Number(comment.likeCount) - 1);
      await comment.save();
      return res.json({ message: "Unliked comment.", success: true });
    } else {
      await CommentLike.create({ userId, commentId });
      comment.likeCount = String(Number(comment.likeCount) + 1);
      await comment.save();
      return res.json({ message: "Liked comment.", success: true });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};
