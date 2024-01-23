import { Request, Response } from "express";
import "../utils/extended-express";
import Exhibition from "../models/exhibition.model";

export const registerExhibition = async (req: Request, res: Response) => {
  const userId: string = req.userId;
  try {
    const {
      galleryId,
      name,
      description,
      startDate,
      endDate,
      openingTime,
      closingTime,
    } = req.body;
    const newExhibition = await Exhibition.create({
      galleryId,
      userId,
      name,
      description,
      startDate,
      endDate,
      openingTime,
      closingTime,
    });
    return res.status(200).json({
      message: "Exhibition registered successfully",
      success: true,
      data: newExhibition,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getExhibitionById = async (req: Request, res: Response) => {
  const { exhibitionId } = req.params;
  try {
    const exhibition = await Exhibition.findById(exhibitionId);
    if (!exhibition) {
      return res
        .status(404)
        .json({ message: "Exhibition not found", success: false });
    }
    return res.status(200).json({
      message: "Exhibition fetched successfully",
      success: true,
      data: exhibition,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
