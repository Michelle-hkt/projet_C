import { Router } from "express";
import agentVisitController from "../controllers/agentVisit.controller.js";
import auth from "../middlewares/auth.middleware.js";
import { isAgent } from "../middlewares/role.middleware.js";

const agentVisitRouter = Router();

agentVisitRouter.get(
  "/pending",
  auth,
  isAgent,
  agentVisitController.getPendingVisits
);

agentVisitRouter.get(
  "/accepted",
  auth,
  isAgent,
  agentVisitController.getMyAcceptedVisits
);

agentVisitRouter.get(
  "/confirmed",
  auth,
  isAgent,
  agentVisitController.getMyConfirmedVisits
);

agentVisitRouter.put(
  "/:visitId/accept",
  auth,
  isAgent,
  agentVisitController.acceptVisit
);

agentVisitRouter.put(
  "/:visitId/confirm",
  auth,
  isAgent,
  agentVisitController.confirmVisit
);

agentVisitRouter.put(
  "/:visitId/cancel",
  auth,
  isAgent,
  agentVisitController.cancelVisit
);

export default agentVisitRouter;
