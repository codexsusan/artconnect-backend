import express, {Router} from "express";
import {
  createArtwork,
  deleteArtworkById,
  fetchArtworkById,
  fetchArtworksByUserId,
} from "../controller/artworks.controller";
import {verifyToken} from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/create", verifyToken, createArtwork);
router.get("/fetch/:artworkId", verifyToken, fetchArtworkById);
router.get("/fetch/artist/:userId", verifyToken, fetchArtworksByUserId);
router.delete("/delete/:artworkId", verifyToken, deleteArtworkById);

export default router;
