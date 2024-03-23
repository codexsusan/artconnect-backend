import express, { Router } from "express";
import { switchLike } from "../controller/artwork-like.controller";
import {
  createArtwork,
  deleteArtworkById,
  fetchArtworkByCategory,
  fetchArtworkById,
  fetchArtworksByUserId,
  fetchLatestArtworks,
  fetchThisMonthTopArtwork,
  fetchThisWeeksTopArtwork,
  fetchTodaysTopArtwork,
} from "../controller/artworks.controller";
import {
  switchBookmark,
  userBookmarks,
} from "../controller/user-bookmarks.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  fetchAllPurchasedArtworks,
  fetchAllSoldArtwork,
} from "../controller/transaction.controller";

const router: Router = express.Router();

router.post("/create", verifyToken, createArtwork);
router.get("/fetch/:artworkId", verifyToken, fetchArtworkById);
router.get("/fetch/artist/:userId", verifyToken, fetchArtworksByUserId);
router.get("/fetch", verifyToken, fetchLatestArtworks);
router.get("/category/:categoryId", verifyToken, fetchArtworkByCategory);
router.delete("/delete/:artworkId", verifyToken, deleteArtworkById);

// Get artwork by time-period
router.get("/fetch/top/today", verifyToken, fetchTodaysTopArtwork);
router.get("/fetch/top/week", verifyToken, fetchThisWeeksTopArtwork);
router.get("/fetch/top/month", verifyToken, fetchThisMonthTopArtwork);

// Artwork likes and bookmarks
router.post("/switch-like", verifyToken, switchLike);
router.post("/switch-bookmark", verifyToken, switchBookmark);
router.get("/bookmark", verifyToken, userBookmarks);

// Purchased Artworks
router.get(
  "/fetch/:userId/purchased/all",
  verifyToken,
  fetchAllPurchasedArtworks
);
router.get("/fetch/:userId/sold/all", verifyToken, fetchAllSoldArtwork);

export default router;
