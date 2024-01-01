import express, { Router } from "express";
import { GetArtistById, RegisterArtist } from "../controller/artist.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/register", verifyToken, RegisterArtist);
router.get("/fetch/:artistId", verifyToken, GetArtistById);
export default router;
