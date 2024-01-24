import UserCategory from "../models/userCategory.model";
import {UserInterface} from "../types";

export const fetchByUserId = async (userId: UserInterface["_id"]) => {
    return UserCategory.find({userId}).select("-__v");
};

