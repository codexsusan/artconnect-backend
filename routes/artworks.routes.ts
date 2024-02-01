import express, {Router} from "express";
import {
  createArtwork,
  deleteArtworkById,
  fetchArtworkById,
  fetchArtworksByUserId,
  fetchLatestArtworks,
} from "../controller/artworks.controller";
import {verifyToken} from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/create", verifyToken, createArtwork);
router.get("/fetch/:artworkId", verifyToken, fetchArtworkById);
router.get("/fetch/artist/:userId", verifyToken, fetchArtworksByUserId);
router.delete("/delete/:artworkId", verifyToken, deleteArtworkById);

router.get("/fetch", verifyToken, fetchLatestArtworks);

export default router;
