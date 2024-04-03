import { Schema, model } from "mongoose";
import { OrderInterface } from "../types";

const OrderModel: Schema<OrderInterface> = new Schema(
  {
    artwork: {
      type: String,
      ref: "Artwork",
      required: true,
    },
    buyer: {
      type: String,
      ref: "User",
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
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", OrderModel);
export default Order;
