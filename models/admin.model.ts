import {Model, model, Schema} from "mongoose";
import {AdminInterface} from "../types";

const adminModel: Schema<AdminInterface> = new Schema({
  name: {
    type: String,
    required: true,
  },
  adminName: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  otp: {
    type: String,
    required: false,
  },
});

const Admin: Model<AdminInterface> = model("Admin", adminModel)
export default Admin;