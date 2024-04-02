import { Request, Response } from "express";
import Artwork from "../models/artworks.model";
import Cart from "../models/cart.model";
import { getArtworkDetailData } from "../services/artwork.services";
import "../utils/extended-express";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { artwork, quantity } = req.body;
    const user = req.userId;

    // Check if the artwork exists
    const artworkExists = await Artwork.findOne({ _id: artwork })
      .select("-__v")
      .populate({
        path: "user",
        select: "name username email profilePicture",
      })
      .sort({ createdAt: -1 });

    if (!artworkExists) {
      return res
        .status(404)
        .json({ message: "Artwork not found", success: false });
    }

    if (!artworkExists.isForSale) {
      return res
        .status(400)
        .json({ message: "Artwork is not for sale", success: false });
    }

    // Add the artwork to cart
    const cart = await Cart.create({
      artwork,
      user,
      quantity,
      createdAt: new Date(),
    });

    res
      .status(201)
      .json({ message: "Artwork added to cart", success: true, data: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const artwork = req.params.artwork;
    const quantity = parseInt(req.params.quantity);
    const user = req.userId;

    const cart = await Cart.findOneAndUpdate(
      { artwork, user },
      { quantity },
      { new: true }
    );

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Artwork not found in cart", success: false });
    }

    return res
      .status(200)
      .json({ message: "Cart item updated", success: true, data: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getAllArtworkFromCart = async (req: Request, res: Response) => {
  try {
    const user = req.userId;

    const cartItems = await Cart.find({ user })
      .select("-__v")
      .sort({ createdAt: -1 });

    if (cartItems.length === 0) {
      return res.status(200).json({
        message: "Cart items fetched.",
        success: true,
        data: cartItems,
      });
    }

    const updatedCartItems = await Promise.all(
      cartItems.map((cartItems) =>
        getArtworkDetailData(cartItems.artwork, user)
      )
    );

    return res.status(200).json({
      message: "Cart items fetched.",
      success: true,
      data: updatedCartItems,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const removeArtworkFromCart = async (req: Request, res: Response) => {
  try {
    const artwork = req.params.artwork;
    const user = req.userId;

    const cartItems = await Cart.findOneAndDelete({ artwork, user });

    if (!cartItems) {
      return res
        .status(404)
        .json({ message: "Artwork not found in cart", success: false });
    }

    return res
      .status(200)
      .json({ message: "Artwork removed from cart", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
