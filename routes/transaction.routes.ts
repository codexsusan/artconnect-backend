import express, { Router } from "express";
import { createTransaction } from "../controller/transaction.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.get("/create/:artworkId", verifyToken, createTransaction);

export default router;
