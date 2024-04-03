import express, { Router } from "express";
import {
  createOrder,
  fetchAllOrders,
  fetchAllSales,
} from "../controller/order.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.get("/create/:artworkId/:quantity", verifyToken, createOrder);
router.get("/fetch/purchase/all", verifyToken, fetchAllOrders);
router.get("/fetch/sales/all", verifyToken, fetchAllSales);

export default router;
