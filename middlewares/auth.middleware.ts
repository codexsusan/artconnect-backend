import { NextFunction, Request, Response } from "express";
import "../utils/extended-express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../constants";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = decoded.userId;
    req.email = decoded.email;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
