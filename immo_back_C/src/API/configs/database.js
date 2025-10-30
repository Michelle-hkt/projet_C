import mongoose from "mongoose";
import initializeRoles from "../services/initRoles.service.js";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`, {});

    console.log("Base de données connectée avec succès");
    console.log(`Base de données : ${process.env.DB_NAME}`);

    await initializeRoles();
  } catch (error) {
    console.error("Erreur de connexion à la base de données :", error.message);

    process.exit(1);
  }
};

export default connectDB;
