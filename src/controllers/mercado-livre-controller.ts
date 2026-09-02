import type { Request, Response } from "express";
import { z } from "zod";
import { mercadoLivreConfig } from "@/configs/mercado-livre";
import {
  connectMercadoLivre,
  getMercadoLivreAuthorizationUrl,
  getMercadoLivreProducts,
} from "@/services/mercado-livre-service";

export class MercadoLivreController {
  authorize(_request: Request, response: Response) {
    return response.json({
      authorizationUrl: getMercadoLivreAuthorizationUrl(),
    });
  }

  async callback(request: Request, response: Response) {
    const query = z
      .object({ code: z.string(), state: z.string() })
      .parse(request.query);
    await connectMercadoLivre(query.code, query.state);
    return response.redirect(
      `${mercadoLivreConfig.webUrl}/?mercadoLivre=connected`,
    );
  }

  async products(request: Request, response: Response) {
    const query = z
      .object({ search: z.string().optional() })
      .parse(request.query);
    return response.json({
      products: await getMercadoLivreProducts(query.search),
    });
  }
}
