import { randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";
import {
  assertMercadoLivreConfig,
  mercadoLivreConfig,
} from "@/configs/mercado-livre";
import { prisma } from "@/database/prisma";

const tokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user_id: z.union([z.string(), z.number()]),
  expires_in: z.number(),
});

const apiBaseUrl = "https://api.mercadolibre.com";

function getStateToken() {
  return jwt.sign(
    { nonce: randomBytes(16).toString("hex") },
    process.env.JWT_SECRET!,
    {
      expiresIn: "10m",
    },
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

  if (!response.ok)
    throw new Error(`Mercado Livre recusou a autorização (${response.status})`);
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
  if (!connection)
    throw new Error("A conta do Mercado Livre ainda não foi conectada");
  if (connection.expiresAt.getTime() > Date.now() + 60_000)
    return connection.accessToken;

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
  if (!response.ok)
    throw new Error("Não foi possível renovar a autorização do Mercado Livre");
  return (
    await saveConnection(tokenResponseSchema.parse(await response.json()))
  ).accessToken;
}

export async function getMercadoLivreProducts(search?: string) {
  const connection = await prisma.mercadoLivreConnection.findUnique({
    where: { id: 1 },
  });
  if (!connection)
    throw new Error("A conta do Mercado Livre ainda não foi conectada");
  const accessToken = await getAccessToken();
  const params = new URLSearchParams({ status: "active", limit: "50" });
  const idsResponse = await fetch(
    `${apiBaseUrl}/users/${connection.sellerId}/items/search?${params}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!idsResponse.ok)
    throw new Error("Não foi possível buscar os produtos no Mercado Livre");
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
  if (!detailsResponse.ok)
    throw new Error("Não foi possível carregar os detalhes dos produtos");
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
    .map((item) => ({
      id: String(item.id),
      title: String(item.title),
      price: Number(item.price ?? 0),
      imageUrl: String(item.thumbnail ?? ""),
      affiliateUrl: String(item.permalink ?? "#"),
      category: item.category_id ? String(item.category_id) : null,
    }));
}

export async function syncMercadoLivreProducts() {
  const products = await getMercadoLivreProducts();
  const syncedAt = new Date();

  await prisma.$transaction(
    products.map((product) =>
      prisma.product.upsert({
        where: { id: product.id },
        create: { ...product, available: true, syncedAt },
        update: { ...product, available: true, syncedAt },
      }),
    ),
  );

  const productIds = products.map((product) => product.id);
  await prisma.product.updateMany({
    where: productIds.length ? { id: { notIn: productIds } } : {},
    data: { available: false, syncedAt },
  });

  return prisma.product.findMany({
    where: { available: true },
    orderBy: { updatedAt: "desc" },
  });
}
