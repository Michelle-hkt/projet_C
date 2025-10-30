import dotenv from "dotenv";
dotenv.config();
import express, { Router } from "express";
import mongoose from "mongoose";
import cors from "cors";
import routers from "./API/routers/index.js";
import connectDB from "./API/configs/database.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/v1", routers);

const serverStart = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      console.log(`URL : http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error("Erreur lors du démarrage du serveur:", error.message);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully");
  await mongoose.connection.close();
  process.exit(0);
});

serverStart();
