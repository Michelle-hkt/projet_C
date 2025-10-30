import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  registerValidation,
  loginValidation,
} from "../validations/auth.validation.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validate(registerValidation),
  authController.register
);
authRouter.post("/login", validate(loginValidation), authController.login);
authRouter.post("/logout", authController.logout);

export default authRouter;
