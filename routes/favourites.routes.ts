import express, { Router } from "express";
import {
  addOrRemoveFavouriteArtwork,
  getFavouriteArtworksByUser,
} from "../controller/favourites.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/switch/:artworkId", verifyToken, addOrRemoveFavouriteArtwork);
router.get("/fetch", verifyToken, getFavouriteArtworksByUser);
export default router;
