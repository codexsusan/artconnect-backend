import {CategoryInterface} from "../types";
import Category from "../models/category.model";

export const fetchByCategoryName = async (categoryName: CategoryInterface["name"]) => {
    return Category.findOne({categoryName});
}

export const fetchCategoryById = async (categoryId: CategoryInterface["_id"]) => {
    return Category.findById(categoryId).select("-__v");
}