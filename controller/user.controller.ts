import { Request, Response } from "express";
import "../utils/extended-express";
import {
  getUserById,
  getUserExceptPasswordAndOTP,
  getUserWithSelect,
} from "../services/user.services";
import User from "../models/user.model";
import { DEFAULT_PROFILE } from "../constants";
import { getPresignedUrl } from "../middlewares/image.middleware";

export const fetchMe = async (req: Request, res: Response) => {
  try {
    const userId: string = req.userId;

    // Fetch User By excluding password and otp
    const user = await getUserWithSelect(userId, "-password -otp -__v");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const profileKey = user.profilePicture;
    const profileUrl =
      profileKey === DEFAULT_PROFILE
        ? DEFAULT_PROFILE
        : await getPresignedUrl(profileKey);

    return res.status(200).json({
      message: "User found",
      success: true,
      data: {
        ...user.toJSON(),
        profilePicture: profileUrl,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const fetchUserById = async (req: Request, res: Response) => {
  const userId: string = req.params.userId;
  try {
    // Fetch User By excluding password and otp
    const user = await getUserExceptPasswordAndOTP(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileKey = user.profilePicture;
    const profileUrl =
      profileKey === DEFAULT_PROFILE
        ? DEFAULT_PROFILE
        : await getPresignedUrl(profileKey);

    return res.status(200).json({
      message: "User found",
      success: true,
      data: {
        ...user.toJSON(),
        profilePicture: profileUrl,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const registerAsArtist = async (req: Request, res: Response) => {
  const userId: string = req.userId;
  try {
    const fetchedUser = await getUserById(userId);

    if (!fetchedUser) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (fetchedUser.isArtist) {
      return res.status(400).json({
        message: "User is already an artist.",
        success: false,
      });
    }

    fetchedUser.isArtist = true;
    await fetchedUser.save();

    return res.status(201).json({
      message: "Artist has been created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await User.findByIdAndUpdate(userId, req.body);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res
      .status(200)
      .json({ message: "User updated successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

// TODO: Need to work with update password, email,etc.
