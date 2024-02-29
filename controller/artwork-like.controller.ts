import { Request, Response } from "express";
import "../utils/extended-express";

import Like from "../models/artwork-like.model";
import Artwork from "../models/artworks.model";
import User from "../models/user.model";
import { disLikeArtwork, likeArtwork } from "../services/artwork-like.services";
import {
  createNotification,
  notifyUsers,
} from "../services/notification.services";
import { NotificationMessageInterface } from "../types";

export const switchLike = async (req: Request, res: Response) => {
  const userId = req.userId;
  const artworkId = req.body.artworkId;
  try {
    const fetchedLike = await Like.findOne({ userId, artworkId });
    const fetchedArtwork = await Artwork.findById(artworkId);
    const authorUser = await User.findById(fetchedArtwork.user).select(
      "deviceToken"
    );

    if (!fetchedArtwork) {
      return res.status(404).json({
        message: "Artwork not found",
        success: false,
      });
    }

    const fetchedUser = await User.findById(userId).select("username name");

    if (!fetchedUser) {
      return res.status(403).json({
        message: "Unauthorized user.",
        success: false,
      });
    }

    if (fetchedLike) {
      await disLikeArtwork(
        fetchedLike._id,
        fetchedArtwork.likeCount,
        artworkId
      );
      res.json({
        message: "Like removed successfully.",
        success: true,
      });
    } else {
      await likeArtwork(userId, fetchedArtwork.likeCount, artworkId);
      const notification: NotificationMessageInterface = {
        title: "Liked",
        body: `${fetchedUser.name} has liked your artwork.`,
        tokens: authorUser.deviceToken,
      };

      if (userId !== fetchedArtwork.user) {
        notifyUsers(notification);
        await createNotification(
          fetchedArtwork.user,
          notification.title,
          notification.body
        );
      }

      res.json({
        message: "Like added successfully.",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};
