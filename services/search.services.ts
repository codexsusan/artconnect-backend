import Artwork from "../models/artworks.model";
import User from "../models/user.model";

export const fetchQueryUsers = async (queryString: string) => {
  return await User.find({
    $or: [
      { username: { $regex: queryString, $options: "i" } },
      { fullName: { $regex: queryString, $options: "i" } },
    ],
  })
    .sort({
      followerCount: -1,
    })
    .select("email username name profilePicture isArtist")
    .limit(10);
};

export const fetchQueryArtworks = async (queryString: string) => {
  return await Artwork.find({
    content: { $regex: `${queryString}`, $options: "i" },
  })
    .sort({
      likeCount: -1,
    })
    .select(
      "userId content imageUrls likeCount commentCount isForSale categoryIds"
    )
    .populate({
      path: "categoryIds",
      select: "-__v",
    })
    .limit(10);
};
