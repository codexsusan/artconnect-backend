import {model, Schema} from "mongoose";
import {ArtworkAvailability, ArtworkInterface} from "../types";
import UserModel from "./user.model";

const artworkSchema: Schema<ArtworkInterface> = new Schema<ArtworkInterface>({
    userId: {
        type: String,
        required: true,
        ref: UserModel,
    },
    content: {
        type: String,
        required: false,
        default: "",
    },
    imageUrls: {
        type: [String],
        required: true,
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
        default: false
    },
    price: {
        type: String,
        required: false,
    },
    quantity: {
        type: String,
        required: true,
    },
    availabilityStatus: {
        type: String,
        required: true,
        enum: Object.values(ArtworkAvailability),
        default: ArtworkAvailability.AVAILABLE,
    },
    categoryIds: {
        type: [String],
    }
}, {timestamps: true});

const Artwork = model<ArtworkInterface>("Artwork", artworkSchema);
export default Artwork;
