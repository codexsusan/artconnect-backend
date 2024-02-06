import express from 'express';
import {verifyToken} from "../middlewares/auth.middleware";
import {
  addInterest,
  getUserInterests,
  removeInterest,
  updateInterest,
} from "../controller/user-interest.controller";

const router = express.Router();

router.post("/add", verifyToken, addInterest);
router.get("/fetch", verifyToken, getUserInterests);
router.patch("/update", verifyToken, updateInterest);
router.delete("/delete/:interestId", verifyToken, removeInterest);

export default router;