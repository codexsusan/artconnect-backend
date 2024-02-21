import Comment from "../models/artwork-comment.model";
import CommentLike from "../models/comment-like.model";
import { NestedCommentInterface } from "../types";

export const fetchNestedComments = async (
  commentId: string,
  userId: string
) => {
  const comments = await Comment.find({ parentId: commentId })
    .sort({
      createdAt: -1,
    })
    .populate({
      path: "user",
      select: "username name profilePicture",
    });
  if (!comments || comments.length === 0) {
    return [];
  }
  const updatedComments = await Promise.all(
    comments.map(async (comment) => {
      const isLiked = await CommentLike.findOne({
        commentId: comment._id,
        userId,
      });
      return {
        ...comment.toJSON(),
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
