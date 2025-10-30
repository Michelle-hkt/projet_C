import mongoose from "mongoose";

const notificationModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: [
        "paiement",
        "visite",
        "visite_virtuelle",
        "preference",
        "validation_compte",
      ],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    announcement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Announcement",
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationModel);

export default Notification;
