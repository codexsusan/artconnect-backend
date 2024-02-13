import { Schema, model } from "mongoose";
import { ArtworkCommentInterface } from "../types";

const commentSchema: Schema<ArtworkCommentInterface> = new Schema({
  userId: { type: String, required: true, ref: "User" },
  artworkId: { type: String, required: true },
  content: { type: String, required: true },
  parentId: { type: String, default: "0" },
  createdAt: { type: Date, default: Date.now },
  likeCount: {
    type: String,
    required: true,
    default: "0",
  },
});

const Comment = model("Comment", commentSchema);
export default Comment;
