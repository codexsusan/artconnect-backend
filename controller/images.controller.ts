import { Request, Response } from "express";
import "../utils/extended-express";
import { FileTransfer } from "../types";

export const uploadSingleImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const fileData: FileTransfer = { ...req.file };
    const { location, size, key } = fileData;

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: location,
        size,
        key,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadMultipleImages = async (req: Request, res: Response) => {
  try {
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const fileData: FileTransfer[] = Object.values(req.files);

    const data = fileData.map((file) => {
      const { location, size, key } = file;
      return { url: location, size, key };
    });

    res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
