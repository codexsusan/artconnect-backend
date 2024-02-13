import Comment from "../models/artwork-comment.model";
import { NestedCommentInterface } from "../types";

export const fetchNestedComments = async (commentId: string) => {
  const comments = await Comment.find({ parentId: commentId }).sort({
    createdAt: -1,
  });
  if (!comments || comments.length === 0) {
    return [];
  }
  const nestedComments: NestedCommentInterface[] =
    [] as NestedCommentInterface[];
  for (const comment of comments) {
    const subComments = await fetchNestedComments(comment._id);
    const currentSubComments = {
      _id: comment._id,
      user: comment.user,
      artworkId: comment.artworkId,
      content: comment.content,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      children: subComments,
    };
    nestedComments.push(currentSubComments);
  }
  return nestedComments;
};
