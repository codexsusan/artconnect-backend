import { Request, Response } from "express";
import "../utils/extended-express";
import {
  getUserById,
  getUserExceptPasswordAndOTP,
} from "../services/user.services";

export const FetchMe = async (req: Request, res: Response) => {
  try {
    const userId: string = req.userId;

    // Fetch User By excluding password and otp
    const user = await getUserExceptPasswordAndOTP(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User found", success: true, user });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const FetchUserById = async (req: Request, res: Response) => {
  const userId: string = req.params.userId;
  try {
    // Fetch User By excluding password and otp
    const user = await getUserExceptPasswordAndOTP(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User found", success: true, user });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const UpdateUser = async (req: Request, res: Response) => {
  const userId: string = req.params.userId;
  // const { dateOfBirth, bio, websiteURL } = req.body;
  try {
    const user = await getUserById(userId);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
