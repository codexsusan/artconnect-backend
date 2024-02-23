import { Schema, model } from "mongoose";
import { UserBookmarksInterface } from "../types";

const bookmarkSchema: Schema<UserBookmarksInterface> = new Schema(
  {
    user: {
      type: String,
      required: true,
      ref: "User",
    },
    artwork: {
      type: String,
      required: true,
      ref: "Artwork",
    },
  },
  {
    timestamps: true,
  }
);

const Bookmark = model("Bookmark", bookmarkSchema);
export default Bookmark;
