import { Request, Response } from "express";
import "../utils/extended-express";
import { createUser, getUser, loginUser } from "../services/user.services";
import { UserLoginResponseDto, UserSignupResponseDto } from "../dto/user.dto";

export const RegisterUser = async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  try {
    const signupResponseDto: UserSignupResponseDto = await createUser({
      name,
      email,
      phone,
      password,
    });

    res.status(201).json(signupResponseDto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const LoginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const loginResponseDto: UserLoginResponseDto = await loginUser({
      emailOrPhone: email,
      password,
    });

    return res.status(200).json(loginResponseDto);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const VerifyOTP = async (req: Request, res: Response) => {
  const { otp } = req.body;
  const userId: string = req.userId;

  try {
    // Check if the user exists
    const user = await getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the otp is valid
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update the user's isVerified field
    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "User Verified", success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
