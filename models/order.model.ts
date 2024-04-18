import { Schema, model } from "mongoose";
import { OrderInterface } from "../types";
import Artwork from "./artworks.model";
import User from "./user.model";
import Shipping from "./shipping.model";

const OrderModel: Schema<OrderInterface> = new Schema(
  {
    artwork: {
      type: String,
      ref: Artwork,
      required: true,
    },
    buyer: {
      type: String,
      ref: User,
      required: true,
    },
    shipping: {
      type: String,
      ref: Shipping,
      required: true,
    },
    seller: {
      type: String,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", OrderModel);
export default Order;
