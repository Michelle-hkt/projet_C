import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const visitModel = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    announcementId: {
      type: ObjectId,
      ref: "Announcement",
      required: true,
    },

    visitDate: {
      type: Date,
    },

    visitTime: {
      type: String,
    },

    meetingPlace: {
      type: String,
    },

    status: {
      type: String,
      enum: ["en_attente", "accepter", "confirmer", "effectuer", "annuler"],
      default: "en_attente",
    },

    agentId: {
      type: ObjectId,
      ref: "User",
    },

    // Agent parrain du customer (pour le partage de commission)
    sponsorshipAgentId: {
      type: ObjectId,
      ref: "Agent",
      default: null,
    },

    // Commission payée pour cette visite (si applicable)
    commissionPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Visit = mongoose.model("Visit", visitModel);

export default Visit;
