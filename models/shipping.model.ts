import { Schema, model } from "mongoose";
import { ShippingDetails } from "../types";

const shippingSchema: Schema<ShippingDetails> = new Schema({
  user: {
    type: String,
    required: true,
    ref: "User",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
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
