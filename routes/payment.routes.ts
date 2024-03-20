import express, { Router } from "express";
import {
  createPayment,
  createPaymentCheckout,
} from "../controller/payment.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

// router.post("/create/:artworkId", verifyToken, createPayment);
router.post("/create/checkout-session", verifyToken, createPaymentCheckout);

export default router;
