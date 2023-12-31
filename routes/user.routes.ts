import express from "express";
import "../utils/extended-express";
import { FetchMe, FetchUserById } from "../controller/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/me", verifyToken, FetchMe);
router.get("/:userId", verifyToken, FetchUserById);

export default router;
