import { Schema, model } from "mongoose";
import { NotificationInterface } from "../types";

const notificationSchema: Schema<NotificationInterface> = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = model("Notification", notificationSchema);

export default Notification;
