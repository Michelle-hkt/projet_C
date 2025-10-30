import { Router } from "express";
import authRouter from "./auth.router.js";
import propertyTypeRouter from "./propertyType.router.js";
import preferenceKeyRouter from "./preferenceKey.router.js";
import customerRouter from "./customer.router.js";
import announcementRouter from "./announcement.router.js";
import customerAnnouncementRouter from "./customerAnnouncement.router.js";
import paymentRouter from "./payment.router.js";
import agentRouter from "./agent.router.js";
import agentVisitRouter from "./agentVisit.router.js";
import notificationRouter from "./notification.router.js";

const routers = Router();

routers.use("/auth", authRouter);
routers.use("/property-types", propertyTypeRouter);
routers.use("/preferences", preferenceKeyRouter);
routers.use("/customer", customerRouter);
routers.use("/announcements", announcementRouter);
routers.use("/my-announcements", customerAnnouncementRouter);
routers.use("/payment", paymentRouter);
routers.use("/agent", agentRouter);
routers.use("/agent/visits", agentVisitRouter);
routers.use("/notifications", notificationRouter);

export default routers;
