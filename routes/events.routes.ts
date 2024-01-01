import express, { Router } from "express";
import {
  getEventById,
  RegisterEvent,
  removeEventById,
} from "../controller/events.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/register", verifyToken, RegisterEvent);
router.get("/fetch/:eventId", verifyToken, getEventById);
router.delete("/delete/:eventId", verifyToken, removeEventById);
export default router;
