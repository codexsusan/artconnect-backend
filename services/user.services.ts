import {UserInterface} from "../types";
import User from "../models/user.model";

export const getUserByEmail = async (email: UserInterface["email"]) => {
    try {
        return User.findOne({email});
    } catch (e) {
        console.log("Error while fetching user", e);
        throw e;
    }
};

export const getUserByEmailOrPhone = async (
    email: UserInterface["email"],
    phone: UserInterface["phone"],
) => {
    try {
        return User.findOne({
            $or: [{email}, {phone}],
        });
    } catch (e) {
        console.log("Error while fetching user", e);
        throw e;
    }
};

export const getUserById = async (userId: UserInterface["_id"]) => {
    try {
        return User.findById(userId);
    } catch (e) {
        console.log("Error while fetching user", e);
        throw e;
    }
};

export const getUserExceptPasswordAndOTP = async (
    userId: UserInterface["_id"],
) => {
    try {
        return User.findById(userId).select("-password -__v");
    } catch (e) {
        console.log("Error while fetching user", e);
        throw e;
    }
};
