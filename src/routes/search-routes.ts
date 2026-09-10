import { Router } from "express";

import { SearchController } from "@/controllers/search-controller";

const searchRouter = Router();

const searchController = new SearchController();

searchRouter.get("/", searchController.search);

export { searchRouter };
