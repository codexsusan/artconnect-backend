import express, { Router } from "express";
import { switchCommentLike } from "../controller/comment-like.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/switch/:commentId", verifyToken, switchCommentLike);
export default router;
