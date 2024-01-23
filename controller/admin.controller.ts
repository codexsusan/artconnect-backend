import {Request, Response} from "express";
import "../utils/extended-express";
import {getAdminByEmail} from "../services/admin.services";
import {GenerateOTP} from "../utils/otp";
import Admin from "../models/admin.model";
import {createToken} from "../utils/token";
import {clearFieldAfterDelay} from "../utils/general";
import {passwordHasher} from "../utils/password";
import bcrypt from "bcrypt";
import User from "../models/user.model";

export const registerAdmin = async (req: Request, res: Response) => {
    const {name, contact, email, password} = req.body;
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

        // await sendMail(email, "Verify Account", `<h1>OTP: ${otp}</h1>`);

        const newAdmin = await Admin.create({
            name,
            adminName,
            contact,
            email,
            password: hashedPassword,
            otp,
        })

        const token = createToken(newAdmin._id, newAdmin.email);

        await clearFieldAfterDelay(newAdmin._id, Admin, "otp", 60 * 3);

        res.status(201).json({
            message: "Admin Created",
            success: true,
            token,
            otp,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

export const loginAdmin = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {

        const fetchedAdmin = await getAdminByEmail(email);

        const isMatch = await bcrypt.compare(password, fetchedAdmin.password);

        if (!fetchedAdmin || !isMatch) {
            return res.status(404).json({
                message: "Invalid Credentials.",
                success: false
            });
        }

        const token: string = createToken(fetchedAdmin._id, fetchedAdmin.email);
        return res
            .status(200)
            .json({
                message: "Admin Logged In",
                success: true,
                token
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

export const verifyOtp = async (req: Request, res: Response) => {
    const {email, otp} = req.body;
    try {
        const fetchedAdmin = await getAdminByEmail(email);
        if (!fetchedAdmin) {
            return res
                .status(404)
                .json({
                    message: "User not found",
                    success: false
                });
        }

        if (fetchedAdmin.otp === "") {
            return res
                .status(400)
                .json({
                    message: "OTP expired. Please request a new OTP.",
                    success: false,
                });
        }

        if (fetchedAdmin.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP",
                success: false
            });
        }

        fetchedAdmin.isVerified = true;
        await fetchedAdmin.save();

        return res.status(200).json({
            message: "User verified.",
            success: true
        });
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .json({
                message: error.message,
                success: false
            });
    }
}

export const regenerateOTP = async (req: Request, res: Response) => {
    const {email} = req.body;
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

        // await sendMail(email, "Verify Account", `<h1>OTP: ${otp}</h1>`);

        await clearFieldAfterDelay(fetchedAdmin._id, Admin, "otp", 60 * 3);
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
}


export const forgetPassword = async (req: Request, res: Response) => {
    const {email} = req.body;
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
        // await sendMail(email, "Reset Password", `<h1>OTP: ${otp}</h1>`);

        await clearFieldAfterDelay(fetchedAdmin._id, User, "otp", 60 * 3);
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

export const resetPassword = async (req: Request, res: Response) => {
    const {email, password} = req.body;
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
}
