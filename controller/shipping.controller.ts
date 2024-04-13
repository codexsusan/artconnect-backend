import { Request, Response } from "express";
import "../utils/extended-express";
import Shipping from "../models/shipping.model";

export const addShippingAddress = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      address,
      city,
      state,
      postalCode,
      country,
      phoneNumber,
    } = req.body;
    const userId = req.userId;

    if (
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !state ||
      !postalCode ||
      !phoneNumber
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields", success: false });
    }

    const shipping = await Shipping.create({
      user: userId,
      firstName,
      lastName,
      address,
      city,
      state,
      postalCode,
      country,
      phoneNumber: `+91${phoneNumber}`,
    });

    return res.status(201).json({
      message: "Shipping address added",
      success: true,
      data: shipping,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getUserShippingDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const shipping = await Shipping.find({ user: userId }).select("-__v");

    return res.status(200).json({ data: shipping, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getShippingDetailsById = async (req: Request, res: Response) => {
  try {
    const shippingId = req.params.id;
    const shipping = await Shipping.findById(shippingId).select("-__v");

    if (!shipping) {
      return res.status(404).json({
        message: "Shipping address not found",
        success: false,
      });
    }

    return res.status(200).json({ data: shipping, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
