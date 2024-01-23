import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  getExhibitionById,
  registerExhibition,
} from "../controller/exhibition.controller";

const router = express.Router();

router.post("/register", verifyToken, registerExhibition);
router.get("/fetch/:exhibitionId", verifyToken, getExhibitionById);

export default router;
