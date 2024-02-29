import express, { Router } from "express";
import {
  changePassword,
  forgetPassword,
  loginUser,
  regenerateOTP,
  registerUser,
  resetPassword,
  verifyOTP,
} from "../controller/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/regenerate-otp", regenerateOTP);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", verifyToken, changePassword);

export default router;
