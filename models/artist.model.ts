import { model, Model, Schema } from "mongoose";
import { ArtistInterface } from "../types";
import UserModel from "./user.model";

const artistSchema: Schema<ArtistInterface> = new Schema<ArtistInterface>({
  userId: {
    type: String,
    required: true,
    ref: UserModel,
  },
  artistName: {
    type: String,
    required: true,
  },
  biography: {
    type: String,
    required: false,
  },
  contactInfo: {
    type: String,
    required: false,
  },
  socialMediaLinks: {
    type: [String],
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  websiteURL: {
    type: String,
    required: false,
  },
  education: {
    type: String,
    required: false,
  },
  style: {
    type: String,
    required: false,
  },
  awardsHonors: {
    type: [String],
    required: false,
  },
  exhibitions: {
    type: [String],
    required: false,
  },
  collections: {
    type: [String],
    required: false,
  },
  galleryRepresentation: {
    type: String,
    required: false,
  },
  isFeatured: {
    type: Boolean,
    required: false,
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
  joinDate: {
    type: Date,
    required: true,
  },
  profileViews: {
    type: Number,
    required: false,
  },
});

const Artist: Model<ArtistInterface> = model("Artist", artistSchema);
export default Artist;
