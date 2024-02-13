import express, { Router } from "express";
import { sendPushNotification } from "../controller/notification.controller";
const router: Router = express.Router();

// router.get("/send", sendNotification);
export default router;
