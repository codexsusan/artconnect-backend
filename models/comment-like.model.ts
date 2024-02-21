import { Schema, model } from "mongoose";
import { CommentLikeInterface } from "../types";

const commentLikeSchema: Schema<CommentLikeInterface> = new Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    commentId: {
      type: String,
      required: true,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

const CommentLike = model("CommentLike", commentLikeSchema);

export default CommentLike;
