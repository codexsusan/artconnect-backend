import { Schema, model } from "mongoose";
import { ArtworkLikeInterface } from "../types";

const likeModel: Schema<ArtworkLikeInterface> = new Schema(
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
  { timestamps: true }
);

const Like = model("Like", likeModel);

export default Like;
