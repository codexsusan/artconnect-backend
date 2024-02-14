import express, { Router } from "express";

import { verifyToken } from "../middlewares/auth.middleware";
import { fetchUserLatestNotifications } from "../controller/notification.controller";
const router: Router = express.Router();

router.get("/fetch/latest", verifyToken, fetchUserLatestNotifications);

export default router;
