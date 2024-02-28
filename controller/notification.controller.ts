import { Request, Response } from "express";
import "../utils/extended-express";
import User from "../models/user.model";
import Notification from "../models/notification.model";
import { getPresignedUrl } from "../middlewares/image.middleware";
import { DEFAULT_PROFILE } from "../constants";

export const fetchUserLatestNotifications = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;

  // const page = req.query.page || 1;

  const page: number = parseInt((req.query.page || 1) as string);
  const limit: number = parseInt((req.query.limit || 10) as string);

  const totalNotifications = await Notification.countDocuments({
    userId: userId,
  });

  const totalPages = Math.ceil(totalNotifications / limit);
  const skipCount = (page - 1) * limit;

  try {
    const fetchedUser = await User.findById(userId);
    if (!fetchedUser) {
      return res
        .status(404)
        .json({ message: "User not found.", success: false });
    }
    const notifications = await Notification.find({
      userId: userId,
    })
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(limit);

    const updatedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        const { userId, ...extractedNotification } = notification.toJSON();
        const id = notification.userId;
        const user = await User.findById(id).select(
          "name email username profilePicture"
        );

        const key = user.profilePicture;

        const url =
          key === DEFAULT_PROFILE
            ? DEFAULT_PROFILE
            : await getPresignedUrl(key);

        return {
          ...extractedNotification,
          user: { ...user.toJSON(), profilePicture: url },
        };
      })
    );

    return res.status(200).json({
      message: "Fetched successfully.",
      success: true,
      data: updatedNotifications,
      limit,
      page,
      totalPages,
      total: totalNotifications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
