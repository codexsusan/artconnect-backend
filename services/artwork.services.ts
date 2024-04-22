import { FlattenMaps } from "mongoose";
import { DEFAULT_PROFILE } from "../constants";
import { getPresignedUrl } from "../middlewares/image.middleware";
import Like from "../models/artwork-like.model";
import Artwork from "../models/artworks.model";
import Category from "../models/category.model";
import Bookmark from "../models/user-bookmarks.model";
import { ArtworkInterface } from "../types";
import { getBasicUserDetails } from "./user.services";

export const CreateArtwork = async (data: Partial<ArtworkInterface>) => {
  return await Artwork.create({
    ...data,
    creationDate: new Date(),
  });
};

export const ArtworkById = async (id: string) => {
  return Artwork.findById(id)
    .select("-__v")
    .populate({
      path: "user",
      select: "name username email profilePicture",
    })
    .sort({ createdAt: -1 });
};

export const ArtworkByUserId = async (userId: string) => {
  return Artwork.find({ userId }).select("-__v");
};

export const ExtractArtworkCategories = async (
  fetchedArtwork: FlattenMaps<ArtworkInterface>
) => {
  const { categoryIds, ...updatedArtwork } = fetchedArtwork;
  const categoryData = await Category.find({
    _id: { $in: categoryIds },
  }).select("-__v");

  const updatedCategoryData = await Promise.all(
    categoryData.map(async (category) => {
      const imageUrl = await getPresignedUrl(category.imageUrl);
      return {
        ...category.toJSON(),
        imageUrl,
      };
    })
  );
  return {
    updatedArtwork,
    categories: updatedCategoryData,
  };
};

export const checkIsLiked = async (artworkId: string, userId: string) => {
  return await Like.findOne({
    userId,
    artworkId,
  });
};

export const checkIsBookmarked = async (artworkId: string, userId: string) => {
  return await Bookmark.findOne({
    user: userId,
    artwork: artworkId,
  });
};

export const getArtworkDetailData = async (
  artworkId: string,
  currentUserId: string
) => {
  const artwork = await Artwork.findById(artworkId);
  const isLiked = await checkIsLiked(artwork._id, currentUserId);
  const isBookmarked = await checkIsBookmarked(artwork._id, currentUserId);
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
    categories,
  };
};
