import express from "express";
import "../utils/extended-express";
import {
    forgetPassword,
    loginAdmin,
    regenerateOTP,
    registerAdmin,
    resetPassword,
    verifyOtp
} from "../controller/admin.controller";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/verify-otp", verifyOtp);
router.post("/regenerate-otp", regenerateOTP);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
export default router;