import express, { Router } from "express";
import {
  LoginUser,
  RegisterUser,
  VerifyOTP,
} from "../controller/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/verify", verifyToken, VerifyOTP);
export default router;
