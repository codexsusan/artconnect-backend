import express from "express";
import {
  uploadMultipleImages,
  uploadSingleImage,
} from "../controller/images.controller";
import { verifyOTP } from "../controller/auth.controller";
import upload from "../middlewares/image.middleware";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/images", verifyToken, upload.single("images"), uploadSingleImage);
router.post(
  "/images/multiple",
  verifyToken,
  upload.array("images", 10),
  uploadMultipleImages
);
export default router;
