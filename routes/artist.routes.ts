import express, { Router } from "express";
import { RegisterArtist } from "../controller/artist.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/register", verifyToken, RegisterArtist);
export default router;
