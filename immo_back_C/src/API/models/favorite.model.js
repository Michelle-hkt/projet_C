import mongoose from "mongoose";

const favoriteModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    announcement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Announcement",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Favorite = mongoose.model("Favorite", favoriteModel);

export default Favorite;
