import express, { Router } from "express";

import {
  addShippingAddress,
  getShippingDetailsById,
  getUserShippingDetails,
} from "../controller/shipping.controller";

import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/add", verifyToken, addShippingAddress);
router.get("/all", verifyToken, getUserShippingDetails);
router.get("/fetch/:id", verifyToken, getShippingDetailsById);

export default router;
