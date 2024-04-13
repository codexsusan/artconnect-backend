import { Request, Response } from "express";
import "../utils/extended-express";

import Artwork from "../models/artworks.model";
import Order from "../models/order.model";
import { getOrderDetails } from "../services/order.services";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { artworkId, quantity, shippingId } = req.body;
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
      shipping: shippingId,
      price: totalPrice,
    });

    artwork.quantity = (
      parseInt(artwork.quantity) - parseInt(quantity)
    ).toString();

    if (artwork.quantity === "0") {
      artwork.isForSale = false;
    }

    await artwork.save();

    return res
      .status(201)
      .json({ message: "Ordered successfully.", data: order });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: error.message, success: false });
  }
};

export const createMultipleOrders = async (req: Request, res: Response) => {
  try {
    const { ordersDetails, shippingId } = req.body;

    const buyerId = req.userId;

    const orders = await Promise.all(
      ordersDetails.map(
        async (orderDetail: { artworkId: string; quantity: string }) => {
          const { artworkId, quantity } = orderDetail;

          const artwork = await Artwork.findById(artworkId);

          if (!artwork) {
            console.log({
              message: "Artwork not found",
              success: false,
              artworkId,
            });
            return null;
          }

          if (!artwork.isForSale) {
            console.log({ message: "Artwork isn't for sale.", success: false });
            return null;
          }

          if (artwork.quantity < quantity) {
            return null;
          }

          const price = artwork.price;

          const totalPrice = (parseInt(price) * parseInt(quantity)).toString();

          const sellerId = artwork.user;

          const order = await Order.create({
            artwork: artworkId,
            buyer: buyerId,
            seller: sellerId,
            quantity,
            shipping: shippingId,
            price: totalPrice,
          });

          artwork.quantity = (
            parseInt(artwork.quantity) - parseInt(quantity)
          ).toString();

          if (artwork.quantity === "0") {
            artwork.isForSale = false;
          }

          await artwork.save();

          return order;
        }
      )
    );

    return res.status(201).json({
      message: "Orders created successfully.",
      data: orders,
      success: true,
    });
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

    return res.status(200).json({
      data: updatedOrders,
      success: true,
      message: "Orders fetched successfully",
    });
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

    return res.status(200).json({
      data: updatedOrders,
      success: true,
      message: "Fetched all sales.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
