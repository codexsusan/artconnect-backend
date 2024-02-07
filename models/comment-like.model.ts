import { Schema, model } from "mongoose";
import { CommentLikeInterface } from "../types";

const commentLikeSchema: Schema<CommentLikeInterface> = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    commentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CommentLike = model("CommentLike", commentLikeSchema);

export default CommentLike;
