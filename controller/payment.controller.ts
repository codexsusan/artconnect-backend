import { Request, Response } from "express";
import "../utils/extended-express";
import Artwork from "../models/artworks.model";
import { STRIPE_SECRET_KEY } from "../constants";
import { ArtworkInterface } from "../types";
import { Document } from "mongoose";

const stripe = require("stripe")(STRIPE_SECRET_KEY);

export const createPaymentCheckout = async (req: Request, res: Response) => {
  const { artworkId } = req.body;
  try {
    const artwork: Document<ArtworkInterface> &
      Required<{
        price: string;
      }> = await Artwork.findOne({
      _id: artworkId,
      isForSale: true,
      quantity: { $gt: 0 },
    });

    if (!artwork) {
      return res.status(400).json({
        message: "Artwork not for sale.",
        success: false,
      });
    }

    const price = parseInt(artwork.price);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "inr",
    });

    res.status(200).json({
      message: "Checkout created successfully.",
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
