import { Model } from "mongoose";
import User from "../models/user.model";
import Admin from "../models/admin.model";

export const clearAdminOtpAfterDelay = async (
  documentId: string,
  delayInSeconds: number
) => {
  setTimeout(async () => {
    await Admin.findByIdAndUpdate(documentId, {
      otp: "",
    });
  }, delayInSeconds * 1000);
};

export const clearUserOtpAfterDelay = async (
  documentId: string,
  delayInSeconds: number
) => {
  setTimeout(async () => {
    await User.findByIdAndUpdate(documentId, {
      otp: "",
    });
  }, delayInSeconds * 1000);
};
