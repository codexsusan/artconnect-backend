import {Request, Response} from "express";
import "../utils/extended-express";
import bcrypt from "bcrypt";
import {createToken} from "../utils/token";
import {GenerateOTP} from "../utils/otp";
import {getUserByEmail, getUserByEmailOrPhone,} from "../services/user.services";
import User from "../models/user.model";
import {sendMail} from "../utils/sendMail";
import {clearFieldAfterDelay} from "../utils/general";

export const registerUser = async (req: Request, res: Response) => {
    const {name, email, phone, password} = req.body;
    try {
        const fetchedUser = await getUserByEmailOrPhone(email, phone);

        if (fetchedUser) {
            return res.status(400).json({
                message: "Email or Phone No is already in use.",
                success: false,
            });
        }

        // Hash the password before saving to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = GenerateOTP();
        const username = name.concat(otp).split(" ").join("").toLowerCase();

        await sendMail(email, "Verify Account", `<h1>OTP: ${otp}</h1>`);
        // Create a new user instance
        const newUser = await User.create({
            username,
            name,
            email,
            phone,
            password: hashedPassword,
            otp,
            userType: "user",
            accountCreationDate: new Date(),
            lastLoginDate: new Date(),
            isVerified: false,
        });

        // Generate the jwt token
        const token = createToken(newUser._id, newUser.email);

        // Clear the otp field after 3 minutes
        clearFieldAfterDelay(newUser._id, User, "otp", 60 * 3);

        res.status(201).json({
            message: "User Created",
            success: true,
            token,
            otp,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message, success: false});
    }
};
export const loginUser = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        // Check if the user exists
        const user = await getUserByEmail(email);
        if (!user) {
            return res
                .status(404)
                .json({message: "Invalid credentials.", success: false});
        }

        // Compare the passwords
        const isMatch: boolean = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({message: "Invalid Credentials", success: false});
        }

        const token = createToken(user._id, user.email);
        return res
            .status(200)
            .json({message: "User Logged In", success: true, token});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message, success: false});
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    const {email, otp} = req.body;
    try {
        // Check if the user exists
        const user = await getUserByEmail(email);
        if (!user) {
            return res
                .status(404)
                .json({message: "User not found", success: false});
        }

        if (user.otp === "") {
            return res.status(400).json({
                message: "OTP expired. Please request a new OTP.",
                success: false,
            })
        }
        // Check if the otp is valid
        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP",
                success: false
            });
        }

        // Update the user's isVerified field
        user.isVerified = true;
        await user.save();

        return res.status(200).json({message: "User Verified", success: true});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message, success: false});
    }
};

export const regenerateOTP = async (req: Request, res: Response) => {
    const {email} = req.body;
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        const otp = GenerateOTP();
        user.otp = otp;
        await user.save();

        await sendMail(email, "Verify Account", `<h1>OTP: ${otp}</h1>`);

        clearFieldAfterDelay(user._id, User, "otp", 60 * 3);
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
}

export const forgetPassword = async (req: Request, res: Response) => {
    const {email} = req.body;
    try {
        // Check if the user exists
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }
        // Generate the otp
        const otp = GenerateOTP();
        user.secondaryOtp = otp;
        await user.save();

        // Send the otp to the user's email
        await sendMail(email, "Reset Password", `<h1>OTP: ${otp}</h1>`);

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
}


export const verifyResetPasswordOTP = async (req: Request, res: Response) => {
    const {otp, email} = req.body;
    try {
        // Check if the user exists
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        const check: boolean = user.secondaryOtp == otp;
        // Check if the otp is valid
        if (!check) {
            return res.status(400).json({
                message: "Invalid OTP",
                success: false,
            });
        }

        // Send the response
        return res.status(200).json({
            message: "OTP verified.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
            success: false,
        });
    }
}


export const resetPassword = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        // Check if the user exists
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Hash the password before saving to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

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
}