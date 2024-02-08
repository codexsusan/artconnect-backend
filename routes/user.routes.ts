import express from "express";
import "../utils/extended-express";
import {
  fetchMe,
  fetchUserById,
  registerAsArtist,
  updateUser,
} from "../controller/user.controller";
import {verifyToken} from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/me", verifyToken, fetchMe);
router.get("/fetch/:userId", verifyToken, fetchUserById);
router.get("/register/artist", verifyToken, registerAsArtist);
router.patch("/update", verifyToken, updateUser);

export default router;
