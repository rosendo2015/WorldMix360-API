import { createHash, randomBytes } from "node:crypto";

import { mercadoLivreConfig } from "@/configs/mercado-livre";
import { prisma } from "@/database/prisma";

import type { TokenResponse } from "./mercado-livre.types";

export const API_URL = "https://api.mercadolibre.com";

export const MARKETPLACE_ID = "c255826b-2073-4c76-8966-b87f22403090";

const PKCE_EXPIRES_IN_MS = 10 * 60 * 1000;

type AuthorizationState = {
  state: string;
  codeVerifier: string;
  expiresAt: number;
};

let authorizationState: AuthorizationState | null = null;

let accessToken: string | null = null;
let refreshToken: string | null = null;
let tokenExpiresAt = 0;

function getMercadoLivreConfig() {
  const clientId = mercadoLivreConfig.clientId;

  const clientSecret = mercadoLivreConfig.clientSecret;

  const redirectUri = mercadoLivreConfig.redirectUri;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("As configurações do Mercado Livre não estão completas.");
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
  };
}

function createCodeChallenge(codeVerifier: string): string {
  return createHash("sha256").update(codeVerifier).digest("base64url");
}

async function loadMercadoLivreConnection() {
  return prisma.mercadoLivreConnection.findUnique({
    where: {
      id: 1,
    },
  });
}

async function saveMercadoLivreConnection(token: TokenResponse) {
  const expiresAt = new Date(Date.now() + token.expires_in * 1000);

  await prisma.mercadoLivreConnection.upsert({
    where: {
      id: 1,
    },
    create: {
      id: 1,
      sellerId: String(token.user_id),
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt,
    },
    update: {
      sellerId: String(token.user_id),
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt,
    },
  });

  accessToken = token.access_token;
  refreshToken = token.refresh_token;
  tokenExpiresAt = expiresAt.getTime();
}

async function requestMercadoLivreToken(
  code: string,
  codeVerifier: string,
): Promise<TokenResponse> {
  const config = getMercadoLivreConfig();

  const response = await fetch(`${API_URL}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Não foi possível obter o token do Mercado Livre (${response.status}). ${errorText}`,
    );
  }

  return response.json() as Promise<TokenResponse>;
}

async function refreshMercadoLivreToken(): Promise<string> {
  const config = getMercadoLivreConfig();

  const connection = await loadMercadoLivreConnection();

  if (!connection?.refreshToken) {
    throw new Error("Não existe refresh token do Mercado Livre.");
  }

  const response = await fetch(`${API_URL}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: connection.refreshToken,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Não foi possível renovar o token do Mercado Livre (${response.status}). ${errorText}`,
    );
  }

  const token = (await response.json()) as TokenResponse;

  await saveMercadoLivreConnection(token);

  return token.access_token;
}

export async function ensureMercadoLivreAccessToken(): Promise<string> {
  const now = Date.now();

  if (accessToken && tokenExpiresAt > now + 30_000) {
    return accessToken;
  }

  const connection = await loadMercadoLivreConnection();

  if (
    connection?.accessToken &&
    connection.expiresAt.getTime() > now + 30_000
  ) {
    accessToken = connection.accessToken;
    refreshToken = connection.refreshToken;
    tokenExpiresAt = connection.expiresAt.getTime();

    return accessToken;
  }

  if (refreshToken || connection?.refreshToken) {
    return refreshMercadoLivreToken();
  }

  throw new Error("O Mercado Livre não está conectado.");
}

export function getMercadoLivreAuthorizationUrl() {
  const config = getMercadoLivreConfig();

  const state = randomBytes(32).toString("base64url");

  const codeVerifier = randomBytes(64).toString("base64url");

  const codeChallenge = createCodeChallenge(codeVerifier);

  authorizationState = {
    state,
    codeVerifier,
    expiresAt: Date.now() + PKCE_EXPIRES_IN_MS,
  };

  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return {
    authorizationUrl: `https://auth.mercadolivre.com.br/authorization?${params.toString()}`,
    state,
  };
}

export async function connectMercadoLivre(code: string, state: string) {
  if (!authorizationState) {
    throw new Error("Não existe uma autorização do Mercado Livre pendente.");
  }

  if (authorizationState.expiresAt < Date.now()) {
    authorizationState = null;

    throw new Error("A autorização do Mercado Livre expirou.");
  }

  if (authorizationState.state !== state) {
    authorizationState = null;

    throw new Error("Estado de autorização do Mercado Livre inválido.");
  }

  const currentState = authorizationState;

  authorizationState = null;

  const token = await requestMercadoLivreToken(code, currentState.codeVerifier);

  await saveMercadoLivreConnection(token);

  return {
    connected: true,
    sellerId: String(token.user_id),
    expiresIn: token.expires_in,
  };
}
