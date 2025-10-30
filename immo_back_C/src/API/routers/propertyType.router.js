import { Router } from "express";
import propertyTypeController from "../controllers/propertyType.controller.js";
import auth from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const propertyTypeRouter = Router();

propertyTypeRouter.get("/", propertyTypeController.getAllPropertyTypes);
propertyTypeRouter.get("/:id", propertyTypeController.getPropertyTypeById);

propertyTypeRouter.post(
  "/",
  auth,
  isAdmin,
  propertyTypeController.createPropertyType
);

propertyTypeRouter.put(
  "/:id",
  auth,
  isAdmin,
  propertyTypeController.updatePropertyType
);

propertyTypeRouter.delete(
  "/:id",
  auth,
  isAdmin,
  propertyTypeController.deletePropertyType
);

export default propertyTypeRouter;
