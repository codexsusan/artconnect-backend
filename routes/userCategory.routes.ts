import express from 'express';
import {addCategoryChoice, getUserCategories} from "../controller/userCategory.controller";
import {verifyToken} from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/add", verifyToken, addCategoryChoice);
router.get("/fetch", verifyToken, getUserCategories);
export default router;