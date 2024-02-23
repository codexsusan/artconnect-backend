import { Request, Response } from "express";
import { getPresignedUrl } from "../middlewares/image.middleware";
import { FileTransfer } from "../types";
import "../utils/extended-express";

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

    const url = await getPresignedUrl(key);

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url,
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

    const data = await Promise.all(
      fileData.map(async (file) => {
        const { key } = file;
        const updatedKey = key.split("/")[1];
        const url = await getPresignedUrl(updatedKey);
        return { url, key: updatedKey };
      })
    );

    res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      data: {
        ...data,
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
