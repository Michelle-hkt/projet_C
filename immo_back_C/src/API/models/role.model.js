import mongoose from "mongoose";

const roleModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du rôle est obligatoire"],
      unique: true,
      trim: true,
      lowercase: true,
      enum: ["customer", "agent", "admin"],
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleModel);

export default Role;
