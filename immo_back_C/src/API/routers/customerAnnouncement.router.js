import { Router } from "express";
import customerAnnouncementController from "../controllers/customerAnnouncement.controller.js";
import auth from "../middlewares/auth.middleware.js";
import { isCustomerOrAdmin } from "../middlewares/role.middleware.js";

const customerAnnouncementRouter = Router();

customerAnnouncementRouter.post(
  "/",
  auth,
  isCustomerOrAdmin,
  customerAnnouncementController.createMyAnnouncement
);
customerAnnouncementRouter.get(
  "/",
  auth,
  isCustomerOrAdmin,
  customerAnnouncementController.getMyAnnouncements
);
customerAnnouncementRouter.put(
  "/:id",
  auth,
  isCustomerOrAdmin,
  customerAnnouncementController.updateMyAnnouncement
);
customerAnnouncementRouter.delete(
  "/:id",
  auth,
  isCustomerOrAdmin,
  customerAnnouncementController.deleteMyAnnouncement
);

export default customerAnnouncementRouter;
