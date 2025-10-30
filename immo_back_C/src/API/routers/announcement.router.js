import { Router } from "express";
import announcementController from "../controllers/announcement.controller.js";

const announcementRouter = Router();

announcementRouter.get("/search", announcementController.searchAnnouncements);
announcementRouter.get(
  "/recent",
  announcementController.getRecentAnnouncements
);
announcementRouter.get("/", announcementController.getAllAnnouncements);
announcementRouter.get("/:id", announcementController.getAnnouncementById);

export default announcementRouter;
