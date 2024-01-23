import {Model, model, Schema} from "mongoose";
import {UserInterface} from "../types";

const userSchema: Schema<UserInterface> = new Schema<UserInterface>({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profilePicture: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    websiteURL: {
        type: String,
        required: false,
    },
    totalArtworks: {
        type: Number,
        required: false,
        default: 0,
    },
    totalFollowers: {
        type: Number,
        required: false,
        default: 0,
    },
    totalFollowing: {
        type: Number,
        required: false,
        default: 0,
    },
    socialMediaLinks: {
        type: [String],
        required: false,
    },
    interests: {
        type: [String],
        required: false,
    },
    occupation: {
        type: String,
        required: false,
    },
    education: {
        type: String,
        required: false,
    },
    preferredArtStyle: {
        type: String,
        required: false,
    },
    accountCreationDate: {
        type: Date,
        required: true,
    },
    lastLoginDate: {
        type: Date,
        required: true,
    },
    userType: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: false,
    },
    secondaryOtp: {
        type: String,
        required: false,
    },
});

const User: Model<UserInterface> = model("User", userSchema);
export default User;
