import express, { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  fetchAllFollowers,
  fetchAllFollowing,
  followUser,
  unfollowUser,
} from "../controller/user-follower.controller";
const router: Router = express.Router();

router.post("/follow", verifyToken, followUser);
router.post("/unfollow", verifyToken, unfollowUser);
router.get("/followers/:followingId", verifyToken, fetchAllFollowers);
router.get("/following/:followerId", verifyToken, fetchAllFollowing);

export default router;
