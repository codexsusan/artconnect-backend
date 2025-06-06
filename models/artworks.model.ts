import { model, Schema } from "mongoose";
import { ArtworkAvailability, ArtworkInterface } from "../types";

const artworkSchema: Schema<ArtworkInterface> = new Schema<ArtworkInterface>(
  {
    user: {
      type: String,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: false,
      default: "",
    },
    content: {
      type: String,
      required: false,
      default: "",
    },
    imageUrls: {
      type: [String],
      required: true,
      default: [""],
    },
    likeCount: {
      type: String,
      required: true,
      default: "0",
    },
    commentCount: {
      type: String,
      required: true,
      default: "0",
    },
    isForSale: {
      type: Boolean,
      required: true,
      default: false,
    },
    price: {
      type: String,
      required: false,
    },
    quantity: {
      type: String,
      required: false,
      default: "0",
    },
    availabilityStatus: {
      type: String,
      required: false,
      enum: Object.values(ArtworkAvailability),
      default: ArtworkAvailability.AVAILABLE,
    },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

const Artwork = model<ArtworkInterface>("Artwork", artworkSchema);
export default Artwork;
