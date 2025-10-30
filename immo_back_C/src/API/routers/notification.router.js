import { Router } from "express";
import notificationController from "../controllers/notification.controller.js";
import auth from "../middlewares/auth.middleware.js";

const notificationRouter = Router();

notificationRouter.get("/", auth, notificationController.getMyNotifications);

notificationRouter.get(
  "/unread/count",
  auth,
  notificationController.countUnreadNotifications
);

notificationRouter.put(
  "/:notificationId/read",
  auth,
  notificationController.markNotificationAsRead
);

notificationRouter.put(
  "/read-all",
  auth,
  notificationController.markAllNotificationsAsRead
);

notificationRouter.delete(
  "/:notificationId",
  auth,
  notificationController.deleteNotification
);

export default notificationRouter;
