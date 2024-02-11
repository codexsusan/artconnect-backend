import { Request, Response } from "express";
import Category from "../models/category.model";
import UserInterest from "../models/user-interest.model";
import { fetchByUserId } from "../services/user-interest.services";
import "../utils/extended-express";

export const addInterest = async (req: Request, res: Response) => {
  const { interestIds }: { interestIds: string[] } = req.body;
  const userId: string = req.userId;
  try {
    const fetchedUserInterests = await fetchByUserId(userId);

    if (fetchedUserInterests.length > 0) {
      return res.status(400).json({
        message: "User interest already exists",
        success: false,
      });
    }

    const categories = await Category.find({ _id: { $in: interestIds } });

    const userInterestsList = categories.map((category) => {
      return {
        userId,
        interestId: category._id,
      };
    });

    const userInterests = await UserInterest.insertMany(userInterestsList);

    res.status(200).json({
      message: "Categories added.",
      success: true,
      interest: userInterests,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getUserInterests = async (req: Request, res: Response) => {
  const userId: string = req.userId;
  try {
    const fetchedUserInterests = await fetchByUserId(userId);

    res.status(200).json({
      message: "Categories fetched.",
      success: true,
      interests: fetchedUserInterests,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const updateInterest = async (req: Request, res: Response) => {
  const { interestIds }: { interestIds: string[] } = req.body;
  const userId: string = req.userId;
  try {
    const categories = await Category.find({ _id: { $in: interestIds } });
    let count = 0;

    categories.forEach(async (category) => {
      const currentCategory = await UserInterest.find({
        where: {
          userId,
          interestId: category._id,
        },
      });
      if (!currentCategory) {
        count++;
        await UserInterest.create({
          userId,
          interestId: category._id,
        });
      }
    });

    res.status(200).json({
      message: count ? "Categories updated." : "No interest to update.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const removeInterest = async (req: Request, res: Response) => {
  const interestId: string = req.params.interestId;
  const userId = req.userId;
  try {
    const userInterest = await UserInterest.findOne({
      interestId,
      userId,
    });

    if (!userInterest) {
      return res.status(404).json({
        message: "User interest not found.",
        success: false,
      });
    }

    const deletedOne = await UserInterest.deleteOne({
      interestId,
      userId,
    });

    res.status(200).json({
      message: "User interest removed.",
      success: true,
      data: deletedOne,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
