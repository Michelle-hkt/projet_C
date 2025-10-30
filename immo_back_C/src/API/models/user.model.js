import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Le prénom est obligatoire"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Le nom de famille est obligatoire"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'adresse email est obligatoire"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "Le rôle est obligatoire"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userModel);

export default User;
