import { FlattenMaps } from "mongoose";
import Like from "../models/artwork-like.model";
import Artwork from "../models/artworks.model";
import Category from "../models/category.model";
import Bookmark from "../models/user-bookmarks.model";
import { ArtworkInterface } from "../types";

export const CreateArtwork = async (data: any) => {
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
  return {
    updatedArtwork,
    categoryData,
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
    userId,
    artworkId,
  });
};
