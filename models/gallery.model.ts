import { model, Schema } from "mongoose";
import { GalleryInterface } from "../types";
import UserModel from "./user.model";

const gallerySchema: Schema<GalleryInterface> = new Schema<GalleryInterface>({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  curatorId: {
    type: String,
    required: true,
    ref: UserModel,
  },
  establishmentDate: {
    type: Date,
    required: false,
  },
  openingTime: {
    type: String,
    required: false,
  },
  closingTime: {
    type: String,
    required: false,
  },
  contact: {
    type: String,
    required: false,
  },
  isOpenWeekend: {
    type: Boolean,
    required: true,
  },
});

const Gallery = model("Gallery", gallerySchema);
export default Gallery;
