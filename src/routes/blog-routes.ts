import { Router } from "express";

import { BlogController } from "@/controllers/blog-controller";

import { ensureAdmin } from "@/middleware/ensure-admin";

import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const blogRoutes = Router();

const blogController = new BlogController();

// Públicas

blogRoutes.get("/", blogController.index);

// Administrativas
// Devem ficar antes de /:slug para não serem interpretadas como slug.

blogRoutes.get(
  "/admin",
  ensureAuthenticated,
  ensureAdmin,
  blogController.indexAdmin,
);

blogRoutes.get(
  "/id/:id",
  ensureAuthenticated,
  ensureAdmin,
  blogController.showById,
);

blogRoutes.post("/", ensureAuthenticated, ensureAdmin, blogController.create);

blogRoutes.put("/:id", ensureAuthenticated, ensureAdmin, blogController.update);

blogRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  blogController.delete,
);

// Pública por slug
// Deve ficar depois das rotas administrativas específicas.

blogRoutes.get("/:slug", blogController.show);

export { blogRoutes };
