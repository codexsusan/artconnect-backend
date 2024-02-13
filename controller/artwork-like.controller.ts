import { Request, Response } from "express";
import "../utils/extended-express";

import Like from "../models/artwork-like.model";
import Artwork from "../models/artworks.model";
import { disLikeArtwork, likeArtwork } from "../services/artwork-like.services";
import { NotificationMessageInterface } from "../types";
import { getUserById } from "../services/user.services";

export const switchLike = async (req: Request, res: Response) => {
  const userId = req.userId;
  const artworkId = req.body.artworkId;
  try {
    const fetchedLike = await Like.findOne({ userId, artworkId });
    const fetchedArtwork = await Artwork.findById(artworkId).populate("user");

    if (!fetchedArtwork) {
      return res.status(404).json({
        message: "Artwork not found",
        success: false,
      });
    }

    const fetchedUser = await getUserById(userId);

    if (fetchedLike && fetchedUser) {
      await likeArtwork(fetchedLike._id, fetchedArtwork.likeCount, artworkId);
      const notification: NotificationMessageInterface = {
        title: "Liked",
        body: `${fetchedUser.name} has liked your artwork.`,
        tokens: [
          "fLoYl44LSC-0NY7oUA_GVy:APA91bEZrRbHtIg_KemkiFyjXhX9f9V-1h1cyl_7ps4duzeeG1kg3feRsSIs8wJCNQlfQr5zUyR3_smG2Dnl88bJhB1v_jTicl6FHKedTPh_m8FRPyadeoqxJR4fVIFNdKYuyBFLlaKa",
        ], // fetchedArtwork.user.token
      };
      res.json({
        message: "Like removed successfully.",
        success: true,
      });
    } else {
      await disLikeArtwork(userId, fetchedArtwork.likeCount, artworkId);
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
