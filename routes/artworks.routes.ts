import express, { Router } from "express";
import {
  CreateArtwork,
  deleteArtworkById,
  fetchArtworkById,
  fetchArtworksByArtistId,
} from "../controller/artworks.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/create", verifyToken, CreateArtwork);
router.get("/fetch/:artworkId", verifyToken, fetchArtworkById);
router.get("/fetch/artist/:artistId", verifyToken, fetchArtworksByArtistId);
router.delete("/delete/:artworkId", verifyToken, deleteArtworkById);

export default router;
