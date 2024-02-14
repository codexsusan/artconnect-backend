import { Request, Response } from "express";
import "../utils/extended-express";
import UserFollower from "../models/user-follower.model";
import User from "../models/user.model";
import {
  createNotification,
  notifyUsers,
} from "../services/notification.services";
import { NotificationMessageInterface } from "../types";

export const followUser = async (req: Request, res: Response) => {
  try {
    const followerId = req.userId;
    const followingId = req.body.followingId;
    const followStatus = await UserFollower.findOne({
      followingId,
      followerId,
    });

    if (followStatus) {
      return res.json({ success: false, message: "Already following" });
    }

    const userFollow = await UserFollower.create({ followingId, followerId });

    const followingUser = await User.findById(followingId);
    followingUser.totalFollowers += 1;
    await followingUser.save();

    const followerUser = await User.findById(followerId);
    followerUser.totalFollowing += 1;
    await followerUser.save();

    const notification: NotificationMessageInterface = {
      title: "New Follower",
      body: `${followerUser.email} started following you`,
      tokens: followingUser.deviceToken,
    };

    notifyUsers(notification);

    await createNotification(
      followingId,
      notification.title,
      notification.body
    );

    return res.json({
      success: true,
      message: "Followed successfully",
      data: userFollow,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const followerId = req.userId;
    const followingId = req.body.followingId;
    const followStatus = await UserFollower.findOne({
      followingId,
      followerId,
    });

    if (!followStatus) {
      return res.json({ success: false, message: "Not following" });
    }

    await UserFollower.deleteOne({
      followingId,
      followerId,
    });

    const followingUser = await User.findById(followingId);
    followingUser.totalFollowers -= 1;
    await followingUser.save();

    const followerUser = await User.findById(followerId);
    followerUser.totalFollowing -= 1;
    await followerUser.save();

    return res.json({ success: true, message: "Unfollowed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const fetchAllFollowers = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const followers = await UserFollower.find({ followingId: userId }).populate(
      "followerId"
    );

    return res.json({ success: true, data: followers });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const fetchAllFollowing = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const following = await UserFollower.find({ followerId: userId })
      .select("-createdAt -updatedAt -__v")
      .populate({
        path: "followingId",
        select: "email",
      });

    return res.json({ success: true, data: following });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
