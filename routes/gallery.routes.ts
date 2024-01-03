import express from "express";
import {
  deleteGalleryById,
  getGalleryById,
  registerGallery,
} from "../controller/gallery.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", verifyToken, registerGallery);
router.get("/fetch/:galleryId", verifyToken, getGalleryById);
router.delete("/delete/:galleryId", verifyToken, deleteGalleryById);
export default router;
