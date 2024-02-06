import { Schema, model } from "mongoose";
import { UserBookmarksInterface } from "../types";

const bookmarkSchema: Schema<UserBookmarksInterface> = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    artworkId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Bookmark = model("Bookmark", bookmarkSchema);
export default Bookmark;
