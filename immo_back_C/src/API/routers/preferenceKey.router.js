import { Router } from "express";
import preferenceKeyController from "../controllers/preferenceKey.controller.js";
import auth from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const preferenceKeyRouter = Router();

preferenceKeyRouter.get("/", preferenceKeyController.getAllPreferences);

preferenceKeyRouter.post(
  "/",
  auth,
  isAdmin,
  preferenceKeyController.createPreference
);

preferenceKeyRouter.put(
  "/:id",
  auth,
  isAdmin,
  preferenceKeyController.updatePreference
);

preferenceKeyRouter.delete(
  "/:id",
  auth,
  isAdmin,
  preferenceKeyController.deletePreference
);

export default preferenceKeyRouter;
