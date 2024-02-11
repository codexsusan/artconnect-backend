import { verify } from "crypto";
import express, { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { searchAll } from "../controller/search.controller";

const router: Router = express.Router();

router.get("/", verifyToken, searchAll);

export default router;
