import { Router } from "express";
import customerController from "../controllers/customer.controller.js";
import auth from "../middlewares/auth.middleware.js";

const customerRouter = Router();

customerRouter.put("/profile", auth, customerController.updateProfile);

customerRouter.post("/preferences", auth, customerController.addPreference);
customerRouter.delete(
  "/preferences/:preferenceKeyId",
  auth,
  customerController.removePreference
);
customerRouter.get("/preferences", auth, customerController.getMyPreferences);

customerRouter.post("/favorites", auth, customerController.addFavorite);
customerRouter.delete(
  "/favorites/:announcementId",
  auth,
  customerController.removeFavorite
);
customerRouter.get("/favorites", auth, customerController.getMyFavorites);

export default customerRouter;
