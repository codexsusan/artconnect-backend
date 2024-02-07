import express, { Router } from "express";
import {
  switchBookmark,
  userBookmarks,
} from "../controller/user-bookmarks.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/switch", verifyToken, switchBookmark);
router.get("/fetch", verifyToken, userBookmarks);

export default router;
