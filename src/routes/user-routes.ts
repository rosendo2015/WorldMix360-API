import { Router } from "express";

import { UserController } from "@/controllers/users-controllers";
import { ensureAdmin } from "@/middleware/ensure-admin";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const userRoutes = Router();

const userController = new UserController();

// Cadastro público
userRoutes.post("/", userController.create);

// Somente administrador
userRoutes.get("/", ensureAuthenticated, ensureAdmin, userController.index);

userRoutes.patch(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  userController.update,
);

userRoutes.put("/:id", ensureAuthenticated, ensureAdmin, userController.update);

export { userRoutes };
