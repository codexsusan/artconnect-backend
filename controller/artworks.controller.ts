import { Request, Response } from "express";
import "../utils/extended-express";

import Comment from "../models/artwork-comment.model";
import Like from "../models/artwork-like.model";
import Artwork from "../models/artworks.model";
import Bookmark from "../models/user-bookmarks.model";

import {
  ArtworkById,
  CreateArtwork,
  ExtractArtworkCategories,
  checkIsBookmarked,
  checkIsLiked,
} from "../services/artwork.services";
import { getUserById } from "../services/user.services";

import { ArtworkAvailability } from "../types";

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
      user: fetchedUser._id,
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

    fetchedUser.totalArtworks += 1;
    await fetchedUser.save();

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
  const userId = req.userId;
  try {
    const fetchedArtwork = await ArtworkById(artworkId);
    if (!fetchedArtwork) {
      return res.status(404).json({
        message: "Artwork not found.",
        success: false,
      });
    }

    const isLiked = await checkIsLiked(artworkId, userId);

    const isBookmarked = await Bookmark.findOne({
      userId,
      artworkId,
    });

    const { updatedArtwork, categoryData } = await ExtractArtworkCategories(
      fetchedArtwork.toJSON()
    );

    res.status(200).json({
      message: "Artwork fetched successfully.",
      success: true,
      data: {
        ...updatedArtwork,
        isLiked: isLiked ? true : false,
        isBookmarked: isBookmarked ? true : false,
        categories: categoryData,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const fetchArtworksByUserId = async (req: Request, res: Response) => {
  const userId: string = req.params.userId;
  const currentUserId = req.userId;
  try {
    const fetchedArtworks = await Artwork.find({ user: userId })
      .populate({
        path: "user",
        select: "name username email profilePicture",
      })
      .sort({ createdAt: -1 });

    const updatedArtworks = await Promise.all(
      fetchedArtworks.map(async (artwork) => {
        const isLiked = await checkIsLiked(artwork._id, currentUserId);
        const isBookmarked = await checkIsBookmarked(
          artwork._id,
          currentUserId
        );

        const currentArtwork = {
          ...artwork.toJSON(),
          isLiked: isLiked ? true : false,
          isBookmarked: isBookmarked ? true : false,
        };

        const { updatedArtwork, categoryData } =
          await ExtractArtworkCategories(currentArtwork);

        return {
          ...updatedArtwork,
          categories: categoryData,
        };
      })
    );

    if (!fetchedArtworks) {
      return res.status(404).json({
        message: "Artworks not found.",
        success: false,
      });
    }
    res.status(200).json({
      message: "Artworks fetched successfully.",
      success: true,
      data: updatedArtworks,
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
      user: userId,
    });

    if (!fetchedArtwork) {
      return res.status(404).json({
        message: "Artwork not found.",
        success: false,
      });
    }

    await Artwork.deleteOne({ _id: artworkId, user: userId });
    await Like.deleteMany({
      artworkId,
    });

    await Comment.deleteMany({
      artworkId,
    });

    const fetchedUser = await getUserById(userId);
    fetchedUser.totalArtworks -= 1;
    await fetchedUser.save();

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
  const userId = req.userId;
  try {
    const fetchedArtworks = await Artwork.find()
      .populate({
        path: "user",
        select: "name username email profilePicture",
      })
      .sort({ createdAt: -1 });

    const updatedArtworks = await Promise.all(
      fetchedArtworks.map(async (artwork) => {
        const isLiked = await checkIsLiked(artwork._id, userId);
        const isBookmarked = await checkIsBookmarked(artwork._id, userId);

        const currentArtwork = {
          ...artwork.toJSON(),
          isLiked: isLiked ? true : false,
          isBookmarked: isBookmarked ? true : false,
        };

        const { updatedArtwork, categoryData } =
          await ExtractArtworkCategories(currentArtwork);

        return {
          ...updatedArtwork,
          categories: categoryData,
        };
      })
    );

    res.status(200).json({
      message: "Artworks fetched successfully.",
      success: true,
      data: updatedArtworks,
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
  const userId = req.userId;
  try {
    const categoryId = req.params.categoryId;
    const fetchedArtworks = await Artwork.find({
      categoryIds: categoryId,
    })
      .populate({
        path: "user",
        select: "name username email profilePicture",
      })
      .sort({ createdAt: -1 });

    const updatedArtworks = await Promise.all(
      fetchedArtworks.map(async (artwork) => {
        const isLiked = await checkIsLiked(artwork._id, userId);
        const isBookmarked = await checkIsBookmarked(artwork._id, userId);

        const currentArtwork = {
          ...artwork.toJSON(),
          isLiked: isLiked ? true : false,
          isBookmarked: isBookmarked ? true : false,
        };

        const { updatedArtwork, categoryData } =
          await ExtractArtworkCategories(currentArtwork);

        return {
          ...updatedArtwork,
          categories: categoryData,
        };
      })
    );

    return res.status(200).json({
      message: "Artworks fetched successfully.",
      success: true,
      data: updatedArtworks,
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
  const userId = req.userId;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fetchedArtworks = await Artwork.find({
      createdAt: { $gte: today, $lt: tomorrow },
    })
      .populate({
        path: "user",
        select: "name username email profilePicture",
      })
      .sort({ likeCount: -1 });

    const updatedArtworks = await Promise.all(
      fetchedArtworks.map(async (artwork) => {
        const isLiked = await checkIsLiked(artwork._id, userId);
        const isBookmarked = await checkIsBookmarked(artwork._id, userId);

        const currentArtwork = {
          ...artwork.toJSON(),
          isLiked: isLiked ? true : false,
          isBookmarked: isBookmarked ? true : false,
        };

        const { updatedArtwork, categoryData } =
          await ExtractArtworkCategories(currentArtwork);

        return {
          ...updatedArtwork,
          categories: categoryData,
        };
      })
    );

    return res.status(200).json({
      message: "Artworks fetched successfully.",
      success: true,
      data: updatedArtworks,
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
  const userId = req.userId;
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const fetchedArtworks = await Artwork.find({
      createdAt: { $gte: startOfWeek, $lt: today },
    })
      .populate({
        path: "user",
        select: "name username email profilePicture",
      })
      .sort({ likeCount: -1 });

    const updatedArtworks = await Promise.all(
      fetchedArtworks.map(async (artwork) => {
        const isLiked = await checkIsLiked(artwork._id, userId);
        const isBookmarked = await checkIsBookmarked(artwork._id, userId);

        const currentArtwork = {
          ...artwork.toJSON(),
          isLiked: isLiked ? true : false,
          isBookmarked: isBookmarked ? true : false,
        };

        const { updatedArtwork, categoryData } =
          await ExtractArtworkCategories(currentArtwork);

        return {
          ...updatedArtwork,
          categories: categoryData,
        };
      })
    );

    return res.status(200).json({
      message: "Artworks fetched successfully.",
      success: true,
      data: updatedArtworks,
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
  const userId = req.userId;
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const fetchedArtworks = await Artwork.find({
      createdAt: { $gte: startOfMonth, $lt: today },
    })
      .populate({
        path: "user",
        select: "name username email profilePicture",
      })
      .sort({ likeCount: -1 });
    const updatedArtworks = await Promise.all(
      fetchedArtworks.map(async (artwork) => {
        const isLiked = await checkIsLiked(artwork._id, userId);
        const isBookmarked = await checkIsBookmarked(artwork._id, userId);

        const currentArtwork = {
          ...artwork.toJSON(),
          isLiked: isLiked ? true : false,
          isBookmarked: isBookmarked ? true : false,
        };

        const { updatedArtwork, categoryData } =
          await ExtractArtworkCategories(currentArtwork);

        return {
          ...updatedArtwork,
          categories: categoryData,
        };
      })
    );

    return res.status(200).json({
      message: "Artworks fetched successfully.",
      success: true,
      data: updatedArtworks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
