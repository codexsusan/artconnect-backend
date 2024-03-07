import express, { Router } from "express";
import { createPaymentCheckout } from "../controller/payment.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/create/checkout-session", verifyToken, createPaymentCheckout);

export default router;
