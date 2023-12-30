import { Request, Response } from "express";
import "../utils/extended-express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { createToken } from "../utils/token";
import { GenerateOTP } from "../utils/otp";

export const RegisterUser = async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  try {
    // Check if the user already exists
    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (user) {
      return res
        .status(400)
        .json({ message: "Email or Phone No is already in use." });
    }

    // Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // TODO:  send it to the user's email or phone
    const otp = GenerateOTP();

    const username = name.split(" ").join("").toLowerCase();
    // Create a new user instance
    const newUser = new User({
      username,
      name,
      email,
      phone,
      otp,
      password: hashedPassword,
      userType: "user",
      accountCreationDate: new Date(),
      lastLoginDate: new Date(),
      isVerified: false,
    });

    // Save the user to the database
    const userData = await newUser.save();

    // Generate the jwt token
    const token = createToken(userData._id, userData.email);

    res
      .status(201)
      .json({ message: "User Created", success: true, token, otp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const LoginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials." });
    }

    // Compare the passwords
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = createToken(user._id, user.email);

    return res
      .status(200)
      .json({ message: "User Logged In", success: true, token });
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
    const user = await User.findById(userId);
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
