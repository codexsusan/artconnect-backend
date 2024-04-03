import { Request, Response } from "express";
import "../utils/extended-express";

import Artwork from "../models/artworks.model";
import Order from "../models/order.model";
import { getArtworkDetailData } from "../services/artwork.services";
import User from "../models/user.model";
import { getPresignedUrl } from "../middlewares/image.middleware";
import { getOrderDetails } from "../services/order.services";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { artworkId, quantity } = req.params;
    const buyerId = req.userId;

    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res
        .status(404)
        .json({ message: "Artwork not found", success: false });
    }

    if (!artwork.isForSale) {
      return res
        .status(400)
        .json({ message: "Artwork isn't for sale.", success: false });
    }

    if (artwork.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Artwork is out of stock.", success: false });
    }

    const price = artwork.price;
    const totalPrice = (parseInt(price) * parseInt(quantity)).toString();

    const sellerId = artwork.user;

    const order = await Order.create({
      artwork: artworkId,
      buyer: buyerId,
      seller: sellerId,
      quantity,
      price: totalPrice,
    });

    artwork.quantity = (
      parseInt(artwork.quantity) - parseInt(quantity)
    ).toString();

    await artwork.save();

    return res.status(201).json({ data: order, success: true });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: error.message, success: false });
  }
};

export const fetchAllOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ buyer: userId })
      .populate({
        path: "artwork",
        select: "-__v",
      })
      .select("-__v");

    const updatedOrders = await Promise.all(
      orders.map(async (order) => getOrderDetails(order._id, userId))
    );

    return res.status(200).json({ data: updatedOrders, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const fetchAllSales = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ seller: userId })
      .populate({
        path: "artwork",
        select: "-__v",
      })
      .select("-__v");

    const updatedOrders = await Promise.all(
      orders.map(async (order) => getOrderDetails(order._id, userId))
    );

    return res.status(200).json({ data: updatedOrders, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
