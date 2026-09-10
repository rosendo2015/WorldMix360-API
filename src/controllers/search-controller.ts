import type { Request, Response } from "express";
import { z } from "zod";

import { searchService } from "@/services/search-service";

const searchSchema = z.object({
  q: z
    .string()
    .trim()
    .min(1, "Informe um termo para pesquisa.")
    .max(100, "O termo de pesquisa é muito longo."),
});

export class SearchController {
  async search(request: Request, response: Response) {
    const { q } = searchSchema.parse(request.query);

    const results = await searchService.search(q);

    return response.json({
      query: q,
      ...results,
    });
  }
}
