import { Router } from "express";
import paymentController from "../controllers/payment.controller.js";
import auth from "../middlewares/auth.middleware.js";
import { isCustomerOrAdmin } from "../middlewares/role.middleware.js";

const paymentRouter = Router();

paymentRouter.post(
  "/virtual-visit",
  auth,
  isCustomerOrAdmin,
  paymentController.payForVirtualVisit
);

paymentRouter.post(
  "/on-site-visit",
  auth,
  isCustomerOrAdmin,
  paymentController.payForOnSiteVisit
);

paymentRouter.post(
  "/create-virtual-tour",
  auth,
  isCustomerOrAdmin,
  paymentController.payForCreateVirtualTour
);

paymentRouter.post(
  "/wallet/recharge",
  auth,
  isCustomerOrAdmin,
  paymentController.rechargeWallet
);

paymentRouter.post(
  "/publish-announcement",
  auth,
  isCustomerOrAdmin,
  paymentController.payForPublishAnnouncement
);

paymentRouter.get(
  "/wallet",
  auth,
  isCustomerOrAdmin,
  paymentController.getWalletBalance
);

export default paymentRouter;
