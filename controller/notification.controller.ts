import { Request, Response } from "express";
import "../utils/extended-express";
import User from "../models/user.model";
import Notification from "../models/notification.model";

export const fetchUserLatestNotifications = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;

  try {
    const fetchedUser = await User.findById(userId);
    if (!fetchedUser) {
      return res
        .status(404)
        .json({ message: "User not found.", success: false });
    }
    const notification = await Notification.find({
      userId: userId,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return res
      .status(200)
      .json({ message: "Fetched successfully.", success: true, notification });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
