import express from "express";
import "../utils/extended-express";
import { fetchMe, fetchUserById } from "../controller/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/me", verifyToken, fetchMe);
router.get("/fetch/:userId", verifyToken, fetchUserById);

export default router;
