import express, { Router } from "express";
import { getArtistById, registerArtist } from "../controller/artist.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/register", verifyToken, registerArtist);
router.get("/fetch/:artistId", verifyToken, getArtistById);
export default router;
