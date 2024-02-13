import Like from "../models/artwork-like.model";
import Artwork from "../models/artworks.model";

export const disLikeArtwork = async (
  likeId: string,
  artworkLikeCount: string,
  artworkId: string
) => {
  await Like.findByIdAndDelete(likeId);
  const likeCount = parseInt(artworkLikeCount) - 1;
  await Artwork.findByIdAndUpdate(artworkId, {
    likeCount,
  });
};

export const likeArtwork = async (
  userId: string,
  artworkLikeCount: string,
  artworkId: string
) => {
  await Like.create({ userId, artworkId });
  const likeCount = parseInt(artworkLikeCount) + 1;
  await Artwork.findByIdAndUpdate(artworkId, {
    likeCount,
  });
};
