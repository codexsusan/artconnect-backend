import express, { Router } from "express";
import {
  createArtwork,
  deleteArtworkById,
  fetchArtworkById,
  fetchArtworksByArtistId,
} from "../controller/artworks.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/create", verifyToken, createArtwork);
router.get("/fetch/:artworkId", verifyToken, fetchArtworkById);
router.get("/fetch/artist/:artistId", verifyToken, fetchArtworksByArtistId);
router.delete("/delete/:artworkId", verifyToken, deleteArtworkById);

export default router;
