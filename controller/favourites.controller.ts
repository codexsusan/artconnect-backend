import { Request, Response } from "express";
import "../utils/extended-express";
import Artwork from "../models/artworks.model";
import Favourites from "../models/favourites.model";

export const addOrRemoveFavouriteArtwork = async (
  req: Request,
  res: Response,
) => {
  const { artworkId } = req.params;
  const userId: string = req.userId;
  try {
    const fetchedArtwork = await Artwork.findById(artworkId);
    if (!fetchedArtwork) {
      return res
        .status(404)
        .json({ message: "Artwork not found", success: false });
    }

    const isFavourite = await Favourites.findOne({
      userId,
      artworkId,
    });

    if (isFavourite) {
      await Favourites.findByIdAndDelete(isFavourite._id);
      return res.status(400).json({
        message: "Artwork has been removed from favourites.",
        success: true,
      });
    }

    const newFavourite = await Favourites.create({
      userId,
      artworkId,
    });

    res.status(200).json({
      message: "Artwork favourite",
      success: true,
      data: newFavourite,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getFavouriteArtworksByUser = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId;
  try {
    const fetchedFavourites = await Favourites.find({ userId });
    res.status(200).json({
      message: "Fetched all favourites",
      success: true,
      data: fetchedFavourites,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};
