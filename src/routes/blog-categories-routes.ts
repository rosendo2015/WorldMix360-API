import { Router } from "express";

import { BlogCategoriesController } from "@/controllers/blog-categories-controller";
import { ensureAdmin } from "@/middleware/ensure-admin";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const blogCategoriesRoutes = Router();

const blogCategoriesController = new BlogCategoriesController();

// Públicas — leitura
blogCategoriesRoutes.get("/", blogCategoriesController.index);

blogCategoriesRoutes.get("/slug/:slug", blogCategoriesController.showBySlug);

// Administrativas — leitura por ID
blogCategoriesRoutes.get(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  blogCategoriesController.showById,
);

// Administrativas — criação
blogCategoriesRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  blogCategoriesController.create,
);

// Administrativas — atualização
blogCategoriesRoutes.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  blogCategoriesController.update,
);

// Administrativas — exclusão
blogCategoriesRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  blogCategoriesController.delete,
);

export { blogCategoriesRoutes };
