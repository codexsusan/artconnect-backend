import express from "express";
import {createCategory, fetchAllCategories, fetchCategory} from "../controller/category.controller";
import {verifyToken} from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/create", createCategory);
router.get("/fetch-all", verifyToken, fetchAllCategories);
router.get("/fetch/:categoryId", verifyToken, fetchCategory);

export default router;