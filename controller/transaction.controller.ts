import { Request, Response } from "express";
import { DEFAULT_PROFILE } from "../constants";
import { getPresignedUrl } from "../middlewares/image.middleware";
import Artwork from "../models/artworks.model";
import Transaction from "../models/transaction.model";
import {
  ExtractArtworkCategories,
  checkIsBookmarked,
  checkIsLiked,
} from "../services/artwork.services";
import { getBasicUserDetails } from "../services/user.services";
import { ArtworkAvailability } from "../types";
import "../utils/extended-express";
import { cacheHandler } from "../utils/redis";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { artworkId } = req.params;
    const buyerId = req.userId;

    console.log(artworkId);

    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res
        .status(404)
        .json({ message: "Artwork not found", success: false });
    }

    const sellerId = artwork.user;
    const transactionAmount = artwork.price;

    if (!artwork.isForSale) {
      return res
        .status(400)
        .json({ message: "Artwork isn't for sale.", success: false });
    }

    if (artwork.availabilityStatus === ArtworkAvailability.SOLD) {
      return res
        .status(400)
        .json({ message: "Artwork is out of stock.", success: false });
    }

    const transaction = await Transaction.create({
      artworkId,
      sellerId,
      buyerId,
      transactionAmount,
    });

    artwork.quantity = (parseInt(artwork.quantity) - 1).toString();

    await artwork.save();

    return res.status(201).json({ data: transaction, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const fetchAllPurchasedArtworks = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.userId;

    const artworks = async () => {
      const transactions = await Transaction.find({
        buyerId: userId,
      });
      return await Promise.all(
        transactions.map(async (transaction) => {
          const artwork = await Artwork.findById(transaction.artworkId).select(
            "-__v"
          );

          if (!artwork) {
            return res
              .status(404)
              .json({ message: "Artwork not found", success: false });
          }

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

          for (const key of originalKeys) {
            const cachedImageUrl = await cacheHandler(
              `images-${key}`,
              3600,
              async () => {
                return getPresignedUrl(key);
              }
            );
            urls.push(cachedImageUrl);
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
            categories: categoryData,
          };
        })
      );
    };

    const userPurchasedArtwork = await cacheHandler(
      `userPurchasedArtwork-${userId}`,
      60,
      artworks
    );

    return res.json({ data: userPurchasedArtwork, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const fetchAllSoldArtwork = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const artworks = async () => {
      const transactions = await Transaction.find({
        sellerId: userId,
      });
      return await Promise.all(
        transactions.map(async (transaction) => {
          const artwork = await Artwork.findById(transaction.artworkId).select(
            "-__v"
          );

          if (!artwork) {
            return res
              .status(404)
              .json({ message: "Artwork not found", success: false });
          }

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

          for (const key of originalKeys) {
            const cachedImageUrl = await cacheHandler(
              `images-${key}`,
              3600,
              async () => {
                return getPresignedUrl(key);
              }
            );
            urls.push(cachedImageUrl);
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
            categories: categoryData,
          };
        })
      );
    };

    const userSoldArtwork = await cacheHandler(
      `userSoldArtwork-${userId}`,
      60,
      artworks
    );

    return res.json({ data: userSoldArtwork, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
