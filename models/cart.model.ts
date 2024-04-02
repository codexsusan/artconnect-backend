import { Schema, model } from "mongoose";
import { Cart } from "../types";

const cartModel: Schema<Cart> = new Schema({
  user: {
    type: String,
    required: true,
    ref: "User",
  },
  artwork: {
    type: String,
    required: true,
    ref: "Artwork",
  },
  quantity: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const Cart = model("Cart", cartModel);
export default Cart;
