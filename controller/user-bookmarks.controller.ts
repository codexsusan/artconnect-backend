import { Request, Response } from "express";
import Bookmark from "../models/user-bookmarks.model";
import "../utils/extended-express";
import Artwork from "../models/artworks.model";
import {
  ExtractArtworkCategories,
  checkIsBookmarked,
  checkIsLiked,
} from "../services/artwork.services";
import { getPresignedUrl } from "../middlewares/image.middleware";

export const switchBookmark = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const artworkId = req.body.artworkId;

    const fetchedBookmark = await Bookmark.findOne({
      user: userId,
      artwork: artworkId,
    });

    if (fetchedBookmark) {
      // delete bookmark
      await Bookmark.findOneAndDelete({ _id: fetchedBookmark._id });
      res.status(200).json({ message: "Bookmark removed", success: true });
    } else {
      // add bookmark
      const bookmark = await Bookmark.create({
        user: userId,
        artwork: artworkId,
      });

      res
        .status(201)
        .json({ message: "Bookmark added", success: true, data: bookmark });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const userBookmarks = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const bookmarks = await Bookmark.find({ user: userId });

    const artworks = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const artwork = await Artwork.findById(bookmark.artwork)
          .populate({
            path: "user",
            select: "name username email profilePicture",
          })
          .select("-__v");

        const isLiked = await checkIsLiked(artwork._id, userId);
        const isBookmarked = await checkIsBookmarked(artwork._id, userId);

        const currentArtwork = {
          ...artwork.toJSON(),
          isLiked: isLiked ? true : false,
          isBookmarked: isBookmarked ? true : false,
        };

        const { updatedArtwork, categoryData } =
          await ExtractArtworkCategories(currentArtwork);

        const originalKeys = updatedArtwork.imageUrls;
        const urls = [];

        for (let key of originalKeys) {
          const url = await getPresignedUrl(key);
          urls.push(url);
        }
        return {
          ...updatedArtwork,
          imageUrls: urls,
          categories: categoryData,
        };
      })
    );

    res.status(200).json({
      message: "Fetched successfully.",
      success: true,
      data: artworks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};
