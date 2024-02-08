import { Request, Response } from "express";
import "../utils/extended-express";
import Artwork from "../models/artworks.model";
import { getUserById } from "../services/user.services";
import { ArtworkAvailability } from "../types";
import Category from "../models/category.model";
import { ArtworkById, CreateArtwork } from "../services/artwork.services";

export const createArtwork = async (req: Request, res: Response) => {
  const userId: string = req.userId;

  const {
    content,
    imageUrls,
    isForSale,
    price,
    quantity,
    availabilityStatus,
    categoryIds,
  } = req.body;

  try {
    const fetchedUser = await getUserById(userId);
    if (!fetchedUser) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    const artworkData = {
      userId: fetchedUser._id,
      content,
      imageUrls,
      isForSale,
      price: isForSale ? price : 0,
      quantity,
      availabilityStatus: isForSale
        ? availabilityStatus
        : ArtworkAvailability.NOTFORSALE,
      categoryIds,
    };

    const newArtwork = await CreateArtwork(artworkData);

    res.status(201).json({
      message: "Artwork has been created successfully.",
      success: true,
      data: newArtwork,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const fetchArtworkById = async (req: Request, res: Response) => {
  const artworkId: string = req.params.artworkId;
  try {
    const fetchedArtwork = await ArtworkById(artworkId);
    if (!fetchedArtwork) {
      return res.status(404).json({
        message: "Artwork not found.",
        success: false,
      });
    }

    const { categoryIds, ...updatedArtwork } = fetchedArtwork.toJSON();
    const categoryData = await Category.find({
      _id: { $in: categoryIds },
    }).select("-__v");

    res.status(200).json({
      message: "Artwork fetched successfully.",
      success: true,
      data: { ...updatedArtwork, categories: categoryData },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const fetchArtworksByUserId = async (req: Request, res: Response) => {
  const userId: string = req.params.userId;
  try {
    const fetchedArtworks = await Artwork.find({ userId });
    if (!fetchedArtworks) {
      return res.status(404).json({
        message: "Artworks not found.",
        success: false,
      });
    }
    res.status(200).json({
      message: "Artworks fetched successfully.",
      success: true,
      data: fetchedArtworks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const deleteArtworkById = async (req: Request, res: Response) => {
  const artworkId: string = req.params.artworkId;
  const userId = req.userId;
  try {
    const fetchedArtwork = await Artwork.findOne({
      _id: artworkId,
      userId,
    });
    if (!fetchedArtwork) {
      return res.status(404).json({
        message: "Artwork not found.",
        success: false,
      });
    }
    await Artwork.deleteOne({ _id: artworkId, userId });

    res.status(200).json({
      message: "Artwork deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const fetchLatestArtworks = async (req: Request, res: Response) => {
  try {
    const fetchedArtworks = await Artwork.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Artworks fetched successfully.",
      success: true,
      data: fetchedArtworks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const fetchArtworkByCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;
    const allArtworks = await Artwork.find({ categoryIds: categoryId });
    return res.status(200).json({
      message: "Artworks fetched successfully.",
      success: true,
      data: allArtworks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const fetchTodaysTopArtwork = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const allArtworks = await Artwork.find({
      createdAt: { $gte: today, $lt: tomorrow },
    }).sort({ likeCount: -1 });
    return res.status(200).json({
      message: "Artworks fetched successfully.",
      success: true,
      data: allArtworks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const fetchThisWeeksTopArtwork = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const allArtworks = await Artwork.find({
      createdAt: { $gte: startOfWeek, $lt: today },
    }).sort({ likeCount: -1 });
    return res.status(200).json({
      message: "Artworks fetched successfully.",
      success: true,
      data: allArtworks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const fetchThisMonthTopArtwork = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const allArtworks = await Artwork.find({
      createdAt: { $gte: startOfMonth, $lt: today },
    }).sort({ likeCount: -1 });
    return res.status(200).json({
      message: "Artworks fetched successfully.",
      success: true,
      data: allArtworks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
