import { Request, Response } from "express";
import "../utils/extended-express";
import UserFollower from "../models/user-follower.model";
import User from "../models/user.model";
import {
  createNotification,
  notifyUsers,
} from "../services/notification.services";
import { NotificationMessageInterface } from "../types";
import { isFollowingStatus } from "../services/user-follower.services";

export const followUser = async (req: Request, res: Response) => {
  try {
    const followerId = req.userId;
    const followingId = req.body.followingId;

    if (followerId === followingId) {
      return res.json({
        message: "You can't follow yourself.",
        success: false,
      });
    }

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
    const followingId = req.params.followingId;

    const page: number = parseInt((req.query.page || 1) as string);
    const limit: number = parseInt((req.query.limit || 10) as string);

    const query = { followingId };

    const totalFollowers = await UserFollower.countDocuments(query);

    const totalPages = Math.ceil(totalFollowers / limit);
    const skipCount = (page - 1) * limit;

    const followers = await UserFollower.find(query)
      .skip(skipCount)
      .limit(limit);

    const followersList = await Promise.all(
      followers.map(async (follower) => {
        const currentFollower = await User.findById(follower.followerId).select(
          "email name username profilePicture"
        );
        const isFollowing = await isFollowingStatus(
          userId,
          follower.followerId
        );
        return {
          ...currentFollower.toJSON(),
          isFollowing,
        };
      })
    );

    return res.json({
      success: true,
      limit,
      page,
      totalPages,
      total: totalFollowers,
      data: followersList,
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

export const fetchAllFollowing = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const followerId = req.params.followerId;

    const page: number = parseInt((req.query.page || 1) as string);
    const limit: number = parseInt((req.query.limit || 10) as string);

    const query = { followerId };

    const totalFollowing = await UserFollower.countDocuments(query);

    const totalPages = Math.ceil(totalFollowing / limit);
    const skipCount = (page - 1) * limit;

    const followings = await UserFollower.find(query)
      .skip(skipCount)
      .limit(limit)
      .select("-createdAt -updatedAt -__v");

    const followingList = await Promise.all(
      followings.map(async (following) => {
        const currentFollowing = await User.findById(
          following.followingId
        ).select("name username email profilePicture");

        const isFollowing = await isFollowingStatus(
          userId,
          following.followingId
        );

        return {
          ...currentFollowing.toJSON(),
          isFollowing,
        };
      })
    );

    return res.json({
      success: true,
      limit,
      page,
      totalPages,
      total: totalFollowing,
      data: followingList,
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
