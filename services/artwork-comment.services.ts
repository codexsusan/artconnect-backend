import { DEFAULT_PROFILE } from "../constants";
import { getPresignedUrl } from "../middlewares/image.middleware";
import Comment from "../models/artwork-comment.model";
import CommentLike from "../models/comment-like.model";
import { NestedCommentInterface } from "../types";
import { getBasicUserDetails } from "./user.services";

export const fetchNestedComments = async (
  commentId: string,
  userId: string
) => {
  const comments = await Comment.find({ parentId: commentId }).sort({
    createdAt: -1,
  });
  // .populate({
  //   path: "user",
  //   select: "username name profilePicture",
  // });
  if (!comments || comments.length === 0) {
    return [];
  }

  const updatedComments = await Promise.all(
    comments.map(async (comment) => {
      const isLiked = await CommentLike.findOne({
        commentId: comment._id,
        userId,
      });

      const user = await getBasicUserDetails(comment.user);

      const profileKey = user.profilePicture;
      const profileUrl =
        profileKey === DEFAULT_PROFILE
          ? DEFAULT_PROFILE
          : await getPresignedUrl(profileKey);

      return {
        ...comment.toJSON(),
        user: {
          ...user.toJSON(),
          profilePicture: profileUrl,
        },
        isLiked: isLiked ? true : false,
      };
    })
  );

  const nestedComments: NestedCommentInterface[] =
    [] as NestedCommentInterface[];
  for (const comment of updatedComments) {
    const subComments = await fetchNestedComments(comment._id, userId);
    const currentSubComments = {
      ...comment,
      children: subComments,
    };
    nestedComments.push(currentSubComments);
  }
  return nestedComments;
};
