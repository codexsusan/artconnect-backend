import { NotificationMessageInterface } from "../types";
import admin from "../utils/notification-admin";

export const notifyUsers = (body: NotificationMessageInterface) => {
  const tokens = [...body.tokens];

  let notification = {
    title: body.title,
    body: body.body,
  };

  const message = {
    notification,
    tokens,
  };

  if (tokens.length !== 0)
    admin
      .messaging()
      .sendEachForMulticast(message)
      .then((response) => {
        console.log(
          "Successfully sent message:",
          response
          // response.results[0].error
        );
        // res.status(200).send("message sent");
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });

  console.log(notification);
  return notification;
};
