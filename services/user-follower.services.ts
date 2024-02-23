import UserFollower from "../models/user-follower.model";

export const isFollowingStatus = async (
  followingId: string,
  followerId: string
) => {
  const followingData = await UserFollower.find({
    followingId,
    followerId,
  });
  return followingData.length === 0 ? false : true;
};
