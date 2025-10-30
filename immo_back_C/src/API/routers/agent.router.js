import { Router } from "express";
import agentController from "../controllers/agent.controller.js";
import auth from "../middlewares/auth.middleware.js";
import {
  isAdmin,
  isAgent,
  isValidAgent,
} from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { registerAgentValidation } from "../validations/agent.validation.js";

const agentRouter = Router();

agentRouter.post(
  "/register",
  validate(registerAgentValidation),
  agentController.registerAgent
);

agentRouter.get("/profile", auth, isAgent, agentController.getMyProfile);

agentRouter.get("/all", auth, isAdmin, agentController.getAllAgents);

agentRouter.get("/pending", auth, isAdmin, agentController.getPendingAgents);

agentRouter.get(
  "/validated",
  auth,
  isAdmin,
  agentController.getValidatedAgents
);

agentRouter.put(
  "/validate/:agentId",
  auth,
  isAdmin,
  agentController.validateAgent
);

agentRouter.put(
  "/invalidate/:agentId",
  auth,
  isAdmin,
  agentController.invalidateAgent
);

agentRouter.delete(
  "/reject/:agentId",
  auth,
  isAdmin,
  agentController.rejectAgent
);

agentRouter.get("/wallet", auth, isAgent, agentController.getMyWalletBalance);

agentRouter.post(
  "/wallet/withdraw",
  auth,
  isAgent,
  agentController.requestWithdrawal
);

// Nouvelles routes pour le système d'assignation et de parrainage
agentRouter.get(
  "/my-announcements",
  auth,
  isAgent,
  agentController.getMyAssignedAnnouncements
);

agentRouter.get(
  "/sponsorship-link",
  auth,
  isAgent,
  agentController.generateSponsorshipLink
);

agentRouter.get(
  "/my-sponsored-customers",
  auth,
  isAgent,
  agentController.getMySponsoredCustomers
);

agentRouter.get(
  "/commissions",
  auth,
  isAgent,
  agentController.getMyCommissions
);

export default agentRouter;
