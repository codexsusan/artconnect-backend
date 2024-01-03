import express, { Router } from "express";
import {
  loginUser,
  registerUser,
  verifyOTP,
} from "../controller/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyToken, verifyOTP);
export default router;
