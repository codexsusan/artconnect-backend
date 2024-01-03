import express, { Router } from "express";
import {
  getEventById,
  registerEvent,
  removeEventById,
} from "../controller/events.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/register", verifyToken, registerEvent);
router.get("/fetch/:eventId", verifyToken, getEventById);
router.delete("/delete/:eventId", verifyToken, removeEventById);
export default router;
