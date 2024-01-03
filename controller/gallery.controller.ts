import { Request, Response } from "express";
import "../utils/extended-express";
import Gallery from "../models/gallery.model";

export const registerGallery = async (req: Request, res: Response) => {
  const userId: string = req.userId;
  // const { name, location, description, establishmentDate, openingTime, closingTime, contact, isOpenWeekend } = req.body;
  // const today = new Date();
  // const formattedDate = moment(today).format("YYYY-MM-DD");
  // console.log(formattedDate);
  try {
    const newGallery = await Gallery.create({
      ...req.body,
      // openingTime: new Date(`${formattedDate}T${req.body.openingTime}:00.000Z`),
      // closingTime: new Date(`${formattedDate}T${req.body.closingTime}:00.000Z`),
      openingTime: req.body.openingTime,
      closingTime: req.body.closingTime,
      establishmentDate: new Date(req.body.establishmentDate),
      curatorId: userId,
    });
    res.status(201).json({
      message: "Gallery created successfully",
      success: true,
      data: newGallery,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const getGalleryById = async (req: Request, res: Response) => {
  const { galleryId } = req.params;
  try {
    const fetchedGallery = await Gallery.findById(galleryId);
    if (!fetchedGallery) {
      return res.status(404).json({
        message: "Gallery not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Gallery found",
      success: true,
      data: fetchedGallery,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const deleteGalleryById = async (req: Request, res: Response) => {
  const galleryId = req.params.galleryId;
  try {
    const fetchedGallery = await Gallery.findById(galleryId);
    if (!fetchedGallery) {
      return res.status(404).json({
        message: "Gallery not found",
        success: false,
      });
    }

    await Gallery.findByIdAndDelete(galleryId);

    res.status(200).json({
      message: "Gallery deleted successfully",
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
