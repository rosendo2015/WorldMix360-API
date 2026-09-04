import { randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";

import {
  assertMercadoLivreConfig,
  mercadoLivreConfig,
} from "@/configs/mercado-livre";

import { prisma } from "@/database/prisma";
import { createSlug } from "@/utils/createSlug";

const tokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user_id: z.union([z.string(), z.number()]),
  expires_in: z.number(),
});

const apiBaseUrl = "https://api.mercadolibre.com";

// id do marketplace cadastrado no banco
const MARKETPLACE_ID = "MERCADOLIVRE";

function getStateToken() {
  return jwt.sign(
    { nonce: randomBytes(16).toString("hex") },
    process.env.JWT_SECRET!,
    { expiresIn: "10m" },
  );
}

export function getMercadoLivreAuthorizationUrl() {
  assertMercadoLivreConfig();

  const params = new URLSearchParams({
    response_type: "code",
    client_id: mercadoLivreConfig.clientId!,
    redirect_uri: mercadoLivreConfig.redirectUri!,
    state: getStateToken(),
  });

  return `https://auth.mercadolivre.com.br/authorization?${params}`;
}

export async function connectMercadoLivre(code: string, state: string) {
  assertMercadoLivreConfig();
  jwt.verify(state, process.env.JWT_SECRET!);

  const response = await fetch(`${apiBaseUrl}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: mercadoLivreConfig.clientId!,
      client_secret: mercadoLivreConfig.clientSecret!,
      code,
      redirect_uri: mercadoLivreConfig.redirectUri!,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mercado Livre recusou a autorização (${response.status})`);
  }

  const token = tokenResponseSchema.parse(await response.json());
  return saveConnection(token);
}

async function saveConnection(token: z.infer<typeof tokenResponseSchema>) {
  return prisma.mercadoLivreConnection.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      sellerId: String(token.user_id),
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: new Date(Date.now() + token.expires_in * 1000),
    },
    update: {
      sellerId: String(token.user_id),
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: new Date(Date.now() + token.expires_in * 1000),
    },
  });
}

async function getAccessToken() {
  const connection = await prisma.mercadoLivreConnection.findUnique({
    where: { id: 1 },
  });

  if (!connection) {
    throw new Error("A conta do Mercado Livre ainda não foi conectada");
  }

  if (connection.expiresAt.getTime() > Date.now() + 60_000) {
    return connection.accessToken;
  }

  assertMercadoLivreConfig();

  const response = await fetch(`${apiBaseUrl}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: mercadoLivreConfig.clientId!,
      client_secret: mercadoLivreConfig.clientSecret!,
      refresh_token: connection.refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Não foi possível renovar a autorização do Mercado Livre");
  }

  const token = tokenResponseSchema.parse(await response.json());
  return (await saveConnection(token)).accessToken;
}

export async function getMercadoLivreProducts(search?: string) {
  const connection = await prisma.mercadoLivreConnection.findUnique({
    where: { id: 1 },
  });

  if (!connection) {
    throw new Error("A conta do Mercado Livre ainda não foi conectada");
  }

  const accessToken = await getAccessToken();

  const params = new URLSearchParams({ status: "active", limit: "50" });

  const idsResponse = await fetch(
    `${apiBaseUrl}/users/${connection.sellerId}/items/search?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!idsResponse.ok) {
    throw new Error("Não foi possível buscar os produtos no Mercado Livre");
  }

  const ids = z
    .object({ results: z.array(z.string()) })
    .parse(await idsResponse.json()).results;

  if (!ids.length) return [];

  const detailsResponse = await fetch(
    `${apiBaseUrl}/items?ids=${ids.join(",")}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!detailsResponse.ok) {
    throw new Error("Não foi possível carregar os detalhes dos produtos");
  }

  const details = z
    .array(z.object({ body: z.record(z.string(), z.unknown()) }))
    .parse(await detailsResponse.json());

  const normalizedSearch = search?.trim().toLocaleLowerCase();

  return details
    .map(({ body }) => body)
    .filter(
      (item) =>
        !normalizedSearch ||
        String(item.title).toLocaleLowerCase().includes(normalizedSearch),
    )
    .map((item) => {
      const externalId = String(item.id);
      const title = String(item.title);
      const currency = item.currency_id ? String(item.currency_id) : "BRL";
      const price = Number(item.price ?? 0);
      const imageUrl = String(item.thumbnail ?? "");
      const affiliateUrl = String(item.permalink ?? "#");
      const slug = createSlug(title, externalId);

      return {
        externalId,
        title,
        slug,
        description: null,
        shortDescription: null,
        imageUrl,
        price,
        originalPrice: null,
        currency,
        rating: null,
        reviewsCount: 0,
        affiliateUrl,
        available: true,
        syncedAt: new Date(),

        // relações obrigatórias
        subcategoryId: "UUID-DA-SUBCATEGORY", // ajustar conforme sua lógica
        marketplaceId: MARKETPLACE_ID,
      };
    });
}

export async function syncMercadoLivreProducts() {
  const products = await getMercadoLivreProducts();
  const syncedAt = new Date();

  await prisma.$transaction(
    products.map((product) =>
      prisma.product.upsert({
        where: {
          externalId_marketplaceId: {
            externalId: product.externalId,
            marketplaceId: product.marketplaceId,
          },
        },
        create: {
          externalId: product.externalId,
          title: product.title,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          imageUrl: product.imageUrl,
          price: product.price,
          originalPrice: product.originalPrice,
          currency: product.currency,
          rating: product.rating,
          reviewsCount: product.reviewsCount,
          affiliateUrl: product.affiliateUrl,
          available: true,
          syncedAt,

          // apenas IDs escalares
          subcategoryId: product.subcategoryId,
          marketplaceId: product.marketplaceId,
        },
        update: {
          title: product.title,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          imageUrl: product.imageUrl,
          price: product.price,
          originalPrice: product.originalPrice,
          currency: product.currency,
          rating: product.rating,
          reviewsCount: product.reviewsCount,
          affiliateUrl: product.affiliateUrl,
          available: true,
          syncedAt,

          subcategoryId: product.subcategoryId,
          marketplaceId: product.marketplaceId,
        },
      }),
    ),
  );

  const externalIds = products.map((p) => p.externalId);

  await prisma.product.updateMany({
    where: externalIds.length
      ? {
          marketplaceId: MARKETPLACE_ID,
          externalId: { notIn: externalIds },
        }
      : { marketplaceId: MARKETPLACE_ID },
    data: { available: false, syncedAt },
  });

  return prisma.product.findMany({
    where: { marketplaceId: MARKETPLACE_ID, available: true },
    orderBy: { updatedAt: "desc" },
  });
}
