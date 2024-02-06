import express, { Router } from "express";
import {
  createArtwork,
  deleteArtworkById,
  fetchArtworkByCategory,
  fetchArtworkById,
  fetchArtworksByUserId,
  fetchLatestArtworks,
} from "../controller/artworks.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { switchLike } from "../controller/artwork-like.controller";
import {
  switchBookmark,
  userBookmarks,
} from "../controller/user-bookmarks.controller";

const router: Router = express.Router();

router.post("/create", verifyToken, createArtwork);
router.get("/fetch/:artworkId", verifyToken, fetchArtworkById);
router.get("/fetch/artist/:userId", verifyToken, fetchArtworksByUserId);
router.delete("/delete/:artworkId", verifyToken, deleteArtworkById);
router.get("/fetch", verifyToken, fetchLatestArtworks);
router.get("/category/:categoryId", verifyToken, fetchArtworkByCategory);
router.post("/switch-like", verifyToken, switchLike);
router.post("/switch-bookmark", verifyToken, switchBookmark);
router.get("/fetch-bookmark", verifyToken, userBookmarks);

export default router;
