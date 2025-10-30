import mongoose from "mongoose";

const walletTransactionModel = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    transactionType: {
      type: String,
      required: true,
      enum: ["deposit", "withdraw", "payment"],
    },
    description: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    comissionRate: {
      type: Number,
    },
    comission: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const WalletTransaction = mongoose.model(
  "WalletTransaction",
  walletTransactionModel
);

export default WalletTransaction;
