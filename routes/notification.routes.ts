import express, { Router } from "express";
import { fetchUserLatestNotifications } from "../controller/notification.controller";
import { verifyToken } from "../middlewares/auth.middleware";
const router: Router = express.Router();

router.get("/fetch/latest", verifyToken, fetchUserLatestNotifications);

export default router;
