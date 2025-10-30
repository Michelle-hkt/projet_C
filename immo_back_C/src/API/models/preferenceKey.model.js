import mongoose from "mongoose";

const preferenceKeyModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const PreferenceKey = mongoose.model("PreferenceKey", preferenceKeyModel);

export default PreferenceKey;
