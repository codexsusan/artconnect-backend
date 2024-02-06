import UserInterest from "../models/user-interest.model";
import {UserInterface} from "../types";

export const fetchByUserId = async (userId: UserInterface["_id"]) => {
    return UserInterest.find({userId}).select("-__v");
};