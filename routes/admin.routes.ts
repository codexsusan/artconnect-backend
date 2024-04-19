import express from "express";
import "../utils/extended-express";
import {
  fetchAllUsers,
  fetchMeAdmin,
  forgetPassword,
  loginAdmin,
  regenerateOTP,
  registerAdmin,
  resetPassword,
  updateAdmin,
  verifyOtp,
} from "../controller/admin.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/verify-otp", verifyOtp);
router.post("/regenerate-otp", regenerateOTP);
router.post("/forget-password", forgetPassword);
router.put("/reset-password", verifyToken, resetPassword);
router.get("/all/user", verifyToken, fetchAllUsers);
router.get("/me", verifyToken, fetchMeAdmin);
router.put("/update", verifyToken, updateAdmin);

export default router;
