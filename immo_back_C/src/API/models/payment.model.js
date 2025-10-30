import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;



const paymentModel = new mongoose.Schema(
  {

    wallet: {
      type: ObjectId,
      ref: "Wallet",
      required: true,
    },

  
    actualAmount: {
      type: Number,
      required: true,
    },

    amountPaid: {
      type: Number,
    },

    paymentMethod: {
      type: String,
      required: true,
    },
 transactionId: {
      type: String,
      trim: true,
    },


    paymentDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
  },
  {
  
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentModel);

export default Payment;
