import mongoose from "mongoose";

const customerModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    contact: {
      phoneNumber: {
        type: String,
        required: true,
      },
      whatsappNumber: {
        type: String,
      },
    },

    address: {
      type: String,
    },

    preferenceKey: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PreferenceKey",
      },
    ],

    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },

    // Agent qui a parrainé ce customer (si applicable)
    sponsoredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerModel);

export default Customer;
