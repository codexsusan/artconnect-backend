import express from "express";

import { verifyToken } from "../middlewares/auth.middleware";
import {
  addToCart,
  getAllArtworkFromCart,
  removeArtworkFromCart,
  updateCartItem,
} from "../controller/cart.controller";

const router = express.Router();

router.post("/add", verifyToken, addToCart);

router.patch(
  "/update/:artwork/quantity/:quantity",
  verifyToken,
  updateCartItem
);

router.get("/all", verifyToken, getAllArtworkFromCart);
router.delete("/remove/:artwork", verifyToken, removeArtworkFromCart);

export default router;
