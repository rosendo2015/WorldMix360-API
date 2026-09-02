import { env } from "../../env";

export const mercadoLivreConfig = {
  clientId: env.MELI_CLIENT_ID,
  clientSecret: env.MELI_CLIENT_SECRET,
  redirectUri: env.MELI_REDIRECT_URI,
  webUrl: env.WEB_URL,
  corsOrigin: env.CORS_ORIGIN,
};

export function assertMercadoLivreConfig() {
  if (
    !mercadoLivreConfig.clientId ||
    !mercadoLivreConfig.clientSecret ||
    !mercadoLivreConfig.redirectUri
  ) {
    throw new Error(
      "MELI_CLIENT_ID, MELI_CLIENT_SECRET e MELI_REDIRECT_URI precisam estar configurados",
    );
  }
}
