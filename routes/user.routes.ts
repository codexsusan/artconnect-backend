import express from "express";
import "../utils/extended-express";
import {fetchMe, fetchUserById, registerAsArtist} from "../controller/user.controller";
import {verifyToken} from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/me", verifyToken, fetchMe);
router.get("/fetch/:userId", verifyToken, fetchUserById);
router.get("/register/artist", verifyToken, registerAsArtist);

export default router;
