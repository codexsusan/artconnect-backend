import { model, Schema } from "mongoose";
import { ExhibitionInterface } from "../types";
import GalleryModel from "./gallery.model";
import UserModel from "./user.model";

const exhibitionSchema: Schema<ExhibitionInterface> =
  new Schema<ExhibitionInterface>({
    galleryId: {
      type: String,
      required: true,
      ref: GalleryModel,
    },
    userId: {
      type: String,
      required: true,
      ref: UserModel,
    },
    name: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    openingTime: {
      type: String,
      required: true,
    },
    closingTime: {
      type: String,
      required: true,
    },
  });

const Exhibition = model("Exhibition", exhibitionSchema);
export default Exhibition;
