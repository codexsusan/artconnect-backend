import express, { Router } from "express";
import { LoginUser, RegisterUser } from "../controller/auth.controller";

const router: Router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
export default router;
