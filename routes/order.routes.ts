import express, { Router } from "express";
import {
  createMultipleOrders,
  createOrder,
  fetchAllOrders,
  fetchAllSales,
} from "../controller/order.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/create", verifyToken, createOrder);
router.post("/create/multiple", verifyToken, createMultipleOrders);
router.get("/fetch/purchase/all", verifyToken, fetchAllOrders);
router.get("/fetch/sales/all", verifyToken, fetchAllSales);

export default router;
