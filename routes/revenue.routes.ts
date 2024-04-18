import express, { Router } from "express";

import { verifyToken } from "../middlewares/auth.middleware";
import {
  getRevenueOfLast7Days,
  getRevenueOfToday,
  getRevenueofLast30days,
} from "../controller/revenue.controller";

const router: Router = express.Router();

router.get("/today", verifyToken, getRevenueOfToday);
router.get("/last-seven-days", verifyToken, getRevenueOfLast7Days);
router.get("/last-thirty-days", verifyToken, getRevenueofLast30days);

export default router;
