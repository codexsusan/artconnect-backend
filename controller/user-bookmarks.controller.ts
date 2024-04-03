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
import { getBasicUserDetails } from "../services/user.services";
import { DEFAULT_PROFILE } from "../constants";

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
      return res
        .status(200)
        .json({ message: "Bookmark removed", success: true });
    } else {
      // add bookmark
      const bookmark = await Bookmark.create({
        user: userId,
        artwork: artworkId,
      });

      return res
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
        const artwork = await Artwork.findById(bookmark.artwork).select("-__v");

        if (!artwork) {
          console.log(bookmark);
          await Bookmark.findOneAndDelete({
            _id: bookmark._id,
          });
          return null;
        }

        const isLiked = await checkIsLiked(artwork._id, userId);
        const isBookmarked = await checkIsBookmarked(artwork._id, userId);

        const currentArtwork = {
          ...artwork.toJSON(),
          isLiked: isLiked ? true : false,
          isBookmarked: isBookmarked ? true : false,
        };

        const { updatedArtwork, categories } =
          await ExtractArtworkCategories(currentArtwork);

        const originalKeys = updatedArtwork.imageUrls;
        const urls = [];

        for (const key of originalKeys) {
          const url = await getPresignedUrl(key);
          urls.push(url);
        }

        const user = await getBasicUserDetails(artwork.user);

        const profileKey = user.profilePicture;
        const profileUrl =
          profileKey === DEFAULT_PROFILE
            ? DEFAULT_PROFILE
            : await getPresignedUrl(profileKey);

        return {
          ...updatedArtwork,
          user: {
            ...user.toJSON(),
            profilePicture: profileUrl,
          },
          imageUrls: urls,
          categories: categories,
        };
      })
    );

    const updatedArtworks = artworks.filter((artwork) => artwork !== null);

    return res.status(200).json({
      message: "Fetched successfully.",
      success: true,
      data: updatedArtworks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
