import express, { Router } from "express";
import {
  addComment,
  addNestedComment,
  fetchAllComments,
  fetchTopLevelComments,
  switchCommentLike,
} from "../controller/artwork-comment.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/:artworkId", verifyToken, addComment);
router.post("/:artworkId/comments/:parentId", verifyToken, addNestedComment);
router.get("/:artworkId", verifyToken, fetchAllComments);
router.post("/switch-like/:commentId", verifyToken, switchCommentLike);



// ***Might get deprecated***
router.get("/top/:artworkId", verifyToken, fetchTopLevelComments);

export default router;
