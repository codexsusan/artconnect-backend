import UserInterest from "../models/user-interest.model";
import { UserInterface } from "../types";

export const fetchInterestByUserId = async (userId: UserInterface["_id"]) => {
  return UserInterest.find({ userId })
    .populate("interestId", "-__v")
    .select("-__v");
};
