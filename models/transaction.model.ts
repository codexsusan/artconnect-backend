import { Schema, model } from "mongoose";
import { TransactionInterface } from "../types";

const TransactionModel: Schema<TransactionInterface> = new Schema(
  {
    artworkId: {
      type: String,
      ref: "Artwork",
      required: true,
    },
    sellerId: {
      type: String,
      ref: "User",
      required: true,
    },
    buyerId: {
      type: String,
      ref: "User",
      required: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    transactionAmount: {
      type: String,
      required: true,
    },
    transactionStatus: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = model("Transaction", TransactionModel);
export default Transaction;
