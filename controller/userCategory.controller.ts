import {Request, Response} from "express";
import "../utils/extended-express";
import {fetchByUserId} from "../services/userCategory.services";
import Category from "../models/category.model";
import UserCategory from "../models/userCategory.model";

export const addCategoryChoice = async (req: Request, res: Response) => {
    const {categoryIds}: { categoryIds: string[] } = req.body;
    const userId: string = req.userId;
    try {
        const fetchedUserCategories = await fetchByUserId(userId);

        if (fetchedUserCategories.length > 0) {
            return res.status(400).json({
                message: "User choices already exists",
                success: false,
            });
        }

        const categories = await Category.find({_id: {$in: categoryIds}});

        const userCategoriesArray = categories.map((category) => {
            return {
                userId,
                categoryId: category._id,
            };
        });

        const userCategories = await UserCategory.insertMany(userCategoriesArray);

        res.status(200).json({
            message: "Categories added.",
            success: true,
            userCategories,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

export const getUserCategories = async (req: Request, res: Response) => {
    const userId: string = req.userId;
    try {
        const fetchedUserCategories = await fetchByUserId(userId);

        res.status(200).json({
            message: "Categories fetched.",
            success: true,
            userCategories: fetchedUserCategories,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
}