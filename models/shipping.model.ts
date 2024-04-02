import { Model, Schema, model } from "mongoose";
import { ShippingDetails } from "../types";

const shippingSchema: Schema<ShippingDetails> = new Schema({
  user: {
    type: String,
    required: true,
    ref: "User",
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

const Shipping = model("Shipping", shippingSchema);
export default Shipping;
