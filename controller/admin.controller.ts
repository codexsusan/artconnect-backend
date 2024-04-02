import { Request, Response } from "express";
import "../utils/extended-express";
import { getAdminByEmail } from "../services/admin.services";
import { GenerateOTP } from "../utils/otp";
import Admin from "../models/admin.model";
import { createToken } from "../utils/token";
import { clearAdminOtpAfterDelay } from "../utils/general";
import { passwordHasher } from "../utils/password";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { sendMail } from "../utils/sendMail";
import { getPresignedUrl } from "../middlewares/image.middleware";
import { DEFAULT_PROFILE } from "../constants";

export const registerAdmin = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const fetchedAdmin = await getAdminByEmail(email);

    if (fetchedAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
        success: false,
      });
    }

    const hashedPassword = await passwordHasher(password);
    const otp = GenerateOTP();
    const adminName = name.concat(otp).split(" ").join("").toLowerCase();

    await sendMail(email, "Verify Account", `<h1>OTP: ${otp}</h1>`);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newAdmin = await Admin.create({
      name,
      adminName,
      email,
      userType: "admin",
      password: hashedPassword,
      // otp,
    });

    // const token = createToken(newAdmin._id, newAdmin.email);

    // await clearAdminOtpAfterDelay(newAdmin._id, 60 * 3);

    res.status(201).json({
      message: "Admin Created",
      success: true,
      // token,
      // otp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const fetchedAdmin = await getAdminByEmail(email);

    if (!fetchedAdmin) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, fetchedAdmin.password);

    if (!isMatch) {
      return res.status(404).json({
        message: "Invalid Credentials.",
        success: false,
      });
    }

    const token: string = createToken(fetchedAdmin._id, fetchedAdmin.email);
    return res.status(200).json({
      message: "Admin Logged In",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  try {
    const fetchedAdmin = await getAdminByEmail(email);
    if (!fetchedAdmin) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (fetchedAdmin.otp === "") {
      return res.status(400).json({
        message: "OTP expired. Please request a new OTP.",
        success: false,
      });
    }

    if (fetchedAdmin.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    fetchedAdmin.isVerified = true;
    await fetchedAdmin.save();

    return res.status(200).json({
      message: "User verified.",
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

export const regenerateOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const fetchedAdmin = await getAdminByEmail(email);
    if (!fetchedAdmin) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const otp: string = GenerateOTP();
    fetchedAdmin.otp = otp;
    await fetchedAdmin.save();

    await sendMail(email, "Verify Account", `<h1>OTP: ${otp}</h1>`);

    // Clear otp after 3 minutes
    await clearAdminOtpAfterDelay(fetchedAdmin._id, 60 * 3);

    // TODO: Need to remove otp from response
    return res.status(200).json({
      message: "OTP sent to your email",
      success: true,
      otp,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e.message,
      success: false,
    });
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    // Check if the user exists
    const fetchedAdmin = await getAdminByEmail(email);
    if (!fetchedAdmin) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    // Generate the otp
    const otp: string = GenerateOTP();
    fetchedAdmin.otp = otp;
    await fetchedAdmin.save();

    // Send the otp to the user's email
    await sendMail(email, "Reset Password", `<h1>OTP: ${otp}</h1>`);

    await clearAdminOtpAfterDelay(fetchedAdmin._id, 60 * 3);
    // Send the response
    return res.status(200).json({
      message: "OTP sent to your email",
      success: true,
      otp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const fetchedAdmin = await getAdminByEmail(email);
    if (!fetchedAdmin) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const hashedPassword = await passwordHasher(password);

    // Update the user's password
    fetchedAdmin.password = hashedPassword;
    await fetchedAdmin.save();

    // Send the response
    return res.status(200).json({
      message: "Password updated successfully.",
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

export const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt((req.query.page || 1) as string);
    const limit: number = parseInt((req.query.limit || 100) as string);

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    const skipCount = (page - 1) * limit;

    const users = await User.find()
      .skip(skipCount)
      .limit(limit)
      .select("-password -__v -lastLogin");

    const updatedUsers = [];
    for (const user of users) {
      const originalKey = user.profilePicture;

      const url =
        originalKey === DEFAULT_PROFILE
          ? DEFAULT_PROFILE
          : await getPresignedUrl(originalKey);

      const newUser = {
        ...user.toJSON(),
        profilePicture: url,
      };
      updatedUsers.push(newUser);
    }
    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      data: updatedUsers,
      totalPages,
      page,
      limit,
      totalUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const fetchMeAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = req.userId;
    const fetchedAdmin = await Admin.findById(adminId).select("-password -__v");
    return res.status(200).json({
      message: "Admin fetched successfully",
      success: true,
      data: fetchedAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
