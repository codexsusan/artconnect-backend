import { Request, Response } from "express";
import "../utils/extended-express";

import Like from "../models/artwork-like.model";
import Artwork from "../models/artworks.model";
import { disLikeArtwork, likeArtwork } from "../services/artwork-like.services";

export const switchLike = async (req: Request, res: Response) => {
  const userId = req.userId;
  const artworkId = req.body.artworkId;
  try {
    const fetchedLike = await Like.findOne({ userId, artworkId });
    const fetchedArtwork = await Artwork.findById(artworkId);

    if (fetchedLike) {
      await likeArtwork(fetchedLike._id, fetchedArtwork.likeCount, artworkId);
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
