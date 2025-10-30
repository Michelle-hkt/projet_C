import mongoose from "mongoose";
import crypto from "crypto";

const agentModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      required: true,
    },

    cipImage: {
      type: String,
      required: true,
    },

    isValide: {
      type: Boolean,
      default: false,
    },

    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },

    // Code de parrainage unique pour chaque agent
    sponsorshipCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Date de dernière assignation (pour la rotation)
    lastAssignedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Générer automatiquement un code de parrainage unique à la validation
agentModel.pre("save", function (next) {
  if (this.isValide && !this.sponsorshipCode) {
    this.sponsorshipCode = `AGT-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;
  }
  next();
});

const Agent = mongoose.model("Agent", agentModel);

export default Agent;
