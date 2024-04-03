import { NotificationMessageInterface } from "../types";
import admin from "../utils/notification-admin";
import Notification from "../models/notification.model";

export const notifyUsers = (body: NotificationMessageInterface) => {
  try {
    const tokens = [...body.tokens];

    const notification = {
      title: body.title,
      body: body.body,
    };

    const message = {
      notification,
      tokens,
    };

    if (tokens.length !== 0) admin.messaging().sendEachForMulticast(message);
    // .then((response) => {
    // console.log(
    //   "Successfully sent message:",
    //   response
    //   response.results[0].error
    // );
    // })
    // .catch((error) => {
    //   console.log("Error sending message:", error);
    // });

    return notification;
  } catch (error) {
    console.log("Error sending message:", error);
  }
  
};

export const createNotification = async (
  userId: string,
  title: NotificationMessageInterface["title"],
  body: NotificationMessageInterface["body"]
) => {
  return await Notification.create({
    userId,
    title,
    body,
  });
};
