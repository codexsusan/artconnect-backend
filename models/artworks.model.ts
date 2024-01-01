import { model, Schema } from "mongoose";
import { ArtworkInterface } from "../types";
import ArtistModel from "./artist.model";

const artworkSchema: Schema<ArtworkInterface> = new Schema<ArtworkInterface>({
  artistId: {
    type: String,
    required: true,
    ref: ArtistModel,
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  imageURLs: {
    type: [String],
    required: true,
  },
  medium: {
    type: String,
    required: false,
  },
  creationDate: {
    type: Date,
    required: false,
  },
  availabilityStatus: {
    type: String,
    required: false,
  },
});

const Artwork = model<ArtworkInterface>("Artwork", artworkSchema);
export default Artwork;
