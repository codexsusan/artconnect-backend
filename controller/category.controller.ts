import { Request, Response } from "express";
import "../utils/extended-express";
import {
  fetchByCategoryName,
  fetchCategoryById,
} from "../services/category.services";
import Category from "../models/category.model";
import Artwork from "../models/artworks.model";
import { getPresignedUrl } from "../middlewares/image.middleware";

export const createCategory = async (req: Request, res: Response) => {
  const { name, imageUrl } = req.body;
  const filteredName = name.trim();
  const categoryName = filteredName.toLowerCase().split(" ").join("-");
  try {
    const fetchedCategory = await fetchByCategoryName(categoryName);
    if (fetchedCategory) {
      return res.status(400).json({
        message: "Category already exists",
        success: false,
      });
    }

    const newCategory = await Category.create({
      name: filteredName,
      categoryName,
      imageUrl,
    });

    const imageKey = newCategory.imageUrl;
    const updatedUrl = await getPresignedUrl(imageKey);

    res.status(201).json({
      message: "Category Created",
      success: true,
      data: {
        ...newCategory.toJSON(),
        imageUrl: updatedUrl,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const fetchAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({}).select("-__v");

    const updatedCategories = await Promise.all(
      categories.map(async (category) => {
        const imageKey = category.imageUrl;
        const updatedUrl = await getPresignedUrl(imageKey);
        return {
          ...category.toJSON(),
          imageUrl: updatedUrl,
        };
      })
    );

    res.status(200).json({
      message: "Categories fetched",
      success: true,
      data: updatedCategories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const fetchCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    const category = await fetchCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }

    const imageKey = category.imageUrl;
    const updatedUrl = await getPresignedUrl(imageKey);

    res.status(200).json({
      message: "Category fetched",
      success: true,
      data: {
        ...category.toJSON(),
        imageUrl: updatedUrl,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }

    // TODO: Need to update artwork category ids after removing category

    res.status(200).json({
      message: "Category deleted",
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
