import express, {Router} from "express";
import {
    forgetPassword,
    loginUser,
    regenerateOTP,
    registerUser,
    resetPassword,
    verifyOTP,
    verifyResetPasswordOTP,
} from "../controller/auth.controller";

const router: Router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyOTP);
router.post("/regenerate-otp", regenerateOTP);
router.post("/forget-password", forgetPassword);
router.post("/verify-reset-password", verifyResetPasswordOTP);
router.post("/reset-password", resetPassword);
export default router;
