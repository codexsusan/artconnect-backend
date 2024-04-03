import express, { Router } from "express";

import { verifyToken } from "../middlewares/auth.middleware";
import {
  fetchUserLatestNotifications,
  pushNotificationHandler,
} from "../controller/notification.controller";
const router: Router = express.Router();

router.get("/fetch/latest", verifyToken, fetchUserLatestNotifications);
router.post("/push/:receiverId", verifyToken, pushNotificationHandler);

export default router;
