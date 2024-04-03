import { Schema, model } from "mongoose";
import { Order } from "../types";

const OrderModel: Schema<Order> = new Schema(
  {
    artworkId: {
      type: String,
      ref: "Artwork",
      required: true,
    },
    buyerId: {
      type: String,
      ref: "User",
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
