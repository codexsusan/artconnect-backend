import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../constants";

export const createToken = (userId: string, email: string) => {
    return jwt.sign({userId, email}, JWT_SECRET, {
        expiresIn: "7d",
    });
};

