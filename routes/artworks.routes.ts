import express, { Router } from "express";
import { switchLike } from "../controller/artwork-like.controller";
import {
  createArtwork,
  deleteArtworkById,
  fetchArtworkByCategory,
  fetchArtworkById,
  fetchArtworksByUserId,
  fetchLatestArtworks,
} from "../controller/artworks.controller";
import {
  switchBookmark,
  userBookmarks,
} from "../controller/user-bookmarks.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/create", verifyToken, createArtwork);
router.get("/fetch/:artworkId", verifyToken, fetchArtworkById);
router.get("/fetch/artist/:userId", verifyToken, fetchArtworksByUserId);
router.get("/fetch", verifyToken, fetchLatestArtworks);
router.get("/category/:categoryId", verifyToken, fetchArtworkByCategory);
router.delete("/delete/:artworkId", verifyToken, deleteArtworkById);

// Artwork likes and bookmarks
router.post("/switch-like", verifyToken, switchLike);
router.post("/switch-bookmark", verifyToken, switchBookmark);
router.get("/bookmark", verifyToken, userBookmarks);

export default router;
