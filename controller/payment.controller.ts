import { Request, Response } from "express";
import "../utils/extended-express";
import Artwork from "../models/artworks.model";
import { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } from "../constants";
import { ArtworkInterface } from "../types";
import { Document } from "mongoose";
import StripeModule from "stripe";
const stripe = new StripeModule(STRIPE_SECRET_KEY);

// const stripe = require("stripe")(STRIPE_SECRET_KEY);

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

    const customer = await stripe.customers.create();

    const ephemeralKey = await stripe.ephemeralKeys.create(
      {
        customer: customer.id,
      },
      {
        apiVersion: "2023-10-16",
      }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "inr",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      description: `You purchased the artwork for ${price} INR.`,
    });

    res.status(200).json({
      message: "Checkout created successfully.",
      success: true,
      data: {
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: STRIPE_PUBLISHABLE_KEY,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { artworkId } = req.params;
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

    const params = {
      card: {
        number: "4242424242424242",
        exp_month: 12,
        exp_year: 2023,
        cvc: 123,
      },
    };

    const token = await stripe.tokens.create({
      card: {
        number: "4242424242424242",
        exp_month: "12",
        exp_year: "2023",
        cvc: "123",
      },
    });

    console.log(token);

    // const customer = await stripe.customers.create({
    //   name: "Name Here",
    //   email: "Email Here",
    //   description: "Customer for purchasing artwork.",
    //   payment_method: "card",
    //   address: {
    //     line1: "510 Townsend St",
    //     postal_code: "98140",
    //     city: "San Francisco",
    //     state: "CA",
    //     country: "US",
    //   },
    // });
    return res.status(200).json({ message: "Token created.", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
