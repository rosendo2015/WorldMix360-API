import { randomBytes } from "node:crypto";
import { mercadoLivreConfig } from "@/configs/mercado-livre";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "../database/prisma";

const API_URL = "https://api.mercadolibre.com";

const MARKETPLACE_ID = "c255826b-2073-4c76-8966-b87f22403090";

const PKCE_EXPIRES_IN_MS = 10 * 60 * 1000;

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  user_id: string | number;
  expires_in: number;
};

type CatalogProduct = {
  id: string;
  status?: string;
  name?: string;
  permalink?: string | null;
  pictures: Array<{
    url?: string;
    secure_url?: string;
  }>;
};

type Offer = {
  item_id: string;
  seller_id: string | number;
  price: number;
  original_price?: number | null;
  currency_id: string;
  category_id?: string;
  warranty?: string;
  condition?: string;
  listing_type_id?: string;
  official_store_id?: string | number | null;
  shipping?: {
    free_shipping?: boolean;
    logistic_type?: string;
  };
  user_product_id?: string;
};

type ImportImageInput = {
  imageUrl: string;
  sortOrder?: number | undefined;
};

type ImportInput = {
  affiliateUrl: string;
  externalLink: string;
  catalogProductId: string;
  itemId: string;
  sellerId: string;
  subcategoryId: string;

  title?: string | undefined;
  description?: string | undefined;
  shortDescription?: string | undefined;
  imageUrl?: string | undefined;

  images?: ImportImageInput[] | undefined;

  originalPrice?: number | null | undefined;
  currency?: string | undefined;
  rating?: number | null | undefined;
  reviewsCount?: number | undefined;

  featured?: boolean | undefined;
  available?: boolean | undefined;
  active?: boolean | undefined;

  seoTitle?: string | undefined;
  seoDescription?: string | undefined;
};

type MercadoLivreAuthorizationState = {
  nonce: string;
  expiresAt: number;
};

type MercadoLivreConfigWithCredentials = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

let authorizationState: MercadoLivreAuthorizationState | null = null;

let accessToken: string | null = null;

let refreshToken: string | null = null;

let tokenExpiresAt = 0;

function getMercadoLivreConfig(): MercadoLivreConfigWithCredentials {
  const clientId = mercadoLivreConfig.clientId;
  const clientSecret = mercadoLivreConfig.clientSecret;
  const redirectUri = mercadoLivreConfig.redirectUri;

  if (!clientId) {
    throw new Error("MELI_CLIENT_ID não configurado.");
  }

  if (!clientSecret) {
    throw new Error("MELI_CLIENT_SECRET não configurado.");
  }

  if (!redirectUri) {
    throw new Error("MELI_REDIRECT_URI não configurado.");
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
  };
}

function ensureValidUrl(value: string, fieldName: string) {
  try {
    new URL(value);
  } catch {
    throw new Error(`${fieldName} inválida.`);
  }
}

function normalizeString(value: string | undefined | null) {
  return value?.trim() ?? "";
}

function normalizeNullableString(value: string | undefined | null) {
  const normalized = normalizeString(value);

  return normalized || null;
}

function normalizeDescription(value: string | undefined | null) {
  const normalized = normalizeString(value);

  if (normalized === "<p></p>") {
    return "";
  }

  return normalized;
}

function normalizeNumber(value: number | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!Number.isFinite(value)) {
    return null;
  }

  return value;
}

function normalizeInteger(value: number | undefined, defaultValue = 0) {
  if (value === undefined) {
    return defaultValue;
  }

  if (!Number.isFinite(value)) {
    return defaultValue;
  }

  return Math.max(0, Math.trunc(value));
}

function normalizeImages(images: ImportImageInput[] | undefined) {
  if (!images?.length) {
    return [];
  }

  return images
    .map((image, index) => ({
      imageUrl: normalizeString(image.imageUrl),
      sortOrder:
        image.sortOrder !== undefined
          ? Math.max(0, Math.trunc(image.sortOrder))
          : index,
    }))
    .filter((image) => image.imageUrl.length > 0);
}

function extractCatalogIdFromUrl(value: string) {
  try {
    const url = new URL(value);

    const match = url.pathname.match(/\/p\/(MLB\d+)/i);

    return match?.[1]?.toUpperCase() ?? null;
  } catch {
    return null;
  }
}

function extractItemIdFromUrl(value: string) {
  try {
    const url = new URL(value);

    const match = url.pathname.match(/\/(MLB\d{8,})/i);

    return match?.[1]?.toUpperCase() ?? null;
  } catch {
    return null;
  }
}

function extractWidFromUrl(value: string) {
  try {
    const url = new URL(value);

    const wid = url.searchParams.get("wid");

    return wid?.trim() || null;
  } catch {
    return null;
  }
}

function serializeOffer(offer: Offer) {
  return {
    itemId: offer.item_id,
    sellerId: String(offer.seller_id),
    price: offer.price,
    originalPrice: offer.original_price ?? null,
    currency: offer.currency_id,
    categoryId: offer.category_id ?? null,
    condition: offer.condition ?? null,
    warranty: offer.warranty ?? null,
    officialStoreId:
      offer.official_store_id !== undefined && offer.official_store_id !== null
        ? String(offer.official_store_id)
        : null,
    freeShipping: offer.shipping?.free_shipping ?? false,
    logisticType: offer.shipping?.logistic_type ?? null,
    listingTypeId: offer.listing_type_id ?? null,
  };
}

function createProductSlug(title: string, itemId: string) {
  const normalizedTitle = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const normalizedItemId = itemId.toLowerCase();

  return `${normalizedTitle || "produto"}-${normalizedItemId}`;
}

function getCatalogImageUrls(catalog: CatalogProduct) {
  const urls = catalog.pictures
    .map((picture) => picture.secure_url ?? picture.url)
    .filter((url): url is string => Boolean(url));

  return [...new Set(urls)];
}

function mergeProductImages(
  catalogImages: string[],
  manualImages: ImportImageInput[],
  manualPrimaryImage: string,
) {
  const result: string[] = [];

  const addImage = (imageUrl: string) => {
    const normalized = normalizeString(imageUrl);

    if (!normalized) {
      return;
    }

    if (!result.includes(normalized)) {
      result.push(normalized);
    }
  };

  for (const imageUrl of catalogImages) {
    addImage(imageUrl);
  }

  addImage(manualPrimaryImage);

  const sortedManualImages = [...manualImages].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  for (const image of sortedManualImages) {
    addImage(image.imageUrl);
  }

  return result;
}

async function mercadoLivreRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!accessToken || Date.now() >= tokenExpiresAt) {
    await ensureMercadoLivreAccessToken();
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body
        ? {
            "Content-Type": "application/json",
          }
        : {}),
      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {}),
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();

  let data: unknown = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        message: text,
      };
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `Erro na API do Mercado Livre: ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

async function requestMercadoLivreToken(code: string): Promise<TokenResponse> {
  const config = getMercadoLivreConfig();

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.redirectUri,
  });

  const response = await fetch(`${API_URL}/oauth/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const text = await response.text();

  let data: unknown = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `Não foi possível obter o token do Mercado Livre (${response.status}).`;

    throw new Error(message);
  }

  if (
    typeof data !== "object" ||
    data === null ||
    !("access_token" in data) ||
    !("refresh_token" in data) ||
    !("user_id" in data) ||
    !("expires_in" in data)
  ) {
    throw new Error("Resposta de token inválida do Mercado Livre.");
  }

  return data as TokenResponse;
}

async function refreshMercadoLivreToken() {
  const config = getMercadoLivreConfig();

  if (!refreshToken) {
    throw new Error(
      "Não existe refresh token do Mercado Livre. Autorize a integração novamente.",
    );
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: refreshToken,
  });

  const response = await fetch(`${API_URL}/oauth/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const text = await response.text();

  let data: unknown = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `Não foi possível atualizar o token do Mercado Livre (${response.status}).`;

    throw new Error(message);
  }

  const token = data as Partial<TokenResponse>;

  if (
    !token.access_token ||
    !token.refresh_token ||
    token.expires_in === undefined
  ) {
    throw new Error("Resposta inválida ao atualizar o token do Mercado Livre.");
  }

  accessToken = token.access_token;

  refreshToken = token.refresh_token;

  tokenExpiresAt = Date.now() + Math.max(0, token.expires_in - 60) * 1000;
}

async function ensureMercadoLivreAccessToken() {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return;
  }

  await refreshMercadoLivreToken();
}

export function getMercadoLivreAuthorizationUrl() {
  const config = getMercadoLivreConfig();

  const nonce = randomBytes(24).toString("hex");

  authorizationState = {
    nonce,
    expiresAt: Date.now() + PKCE_EXPIRES_IN_MS,
  };

  const state = Buffer.from(
    JSON.stringify({
      nonce,
      expiresAt: authorizationState.expiresAt,
    }),
  ).toString("base64url");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    state,
  });

  return `https://auth.mercadolivre.com.br/authorization?${params.toString()}`;
}

export async function connectMercadoLivre(code: string, state: string) {
  if (!authorizationState) {
    throw new Error("Estado de autorização do Mercado Livre não encontrado.");
  }

  if (Date.now() > authorizationState.expiresAt) {
    authorizationState = null;

    throw new Error("O estado de autorização do Mercado Livre expirou.");
  }

  let decodedState: {
    nonce?: string;
    expiresAt?: number;
  };

  try {
    decodedState = JSON.parse(
      Buffer.from(state, "base64url").toString("utf8"),
    ) as {
      nonce?: string;
      expiresAt?: number;
    };
  } catch {
    throw new Error("Estado de autorização do Mercado Livre inválido.");
  }

  if (!decodedState.nonce || decodedState.nonce !== authorizationState.nonce) {
    throw new Error("Estado de autorização do Mercado Livre inválido.");
  }

  if (!decodedState.expiresAt || Date.now() > decodedState.expiresAt) {
    authorizationState = null;

    throw new Error("O estado de autorização do Mercado Livre expirou.");
  }

  const token = await requestMercadoLivreToken(code);

  accessToken = token.access_token;

  refreshToken = token.refresh_token;

  tokenExpiresAt = Date.now() + Math.max(0, token.expires_in - 60) * 1000;

  authorizationState = null;

  return {
    userId: String(token.user_id),
    expiresIn: token.expires_in,
  };
}

async function getCatalogProduct(catalogProductId: string) {
  return mercadoLivreRequest<CatalogProduct>(
    `/products/${encodeURIComponent(catalogProductId)}`,
  );
}

async function getCatalogOffers(catalogProductId: string, sellerId?: string) {
  const params = new URLSearchParams();

  params.set("limit", "50");

  if (sellerId) {
    params.set("seller_id", sellerId);
  }

  return mercadoLivreRequest<{
    paging: {
      total: number;
      offset: number;
      limit: number;
    };
    results: Offer[];
  }>(
    `/products/${encodeURIComponent(
      catalogProductId,
    )}/items?${params.toString()}`,
  );
}

export async function findCatalogOfferByItem(
  catalogProductId: string,
  sellerId: string,
  itemId: string,
) {
  const offers = await getCatalogOffers(catalogProductId, sellerId);

  const offer = offers.results.find(
    (item) => item.item_id === itemId && String(item.seller_id) === sellerId,
  );

  return {
    found: Boolean(offer),
    offer: offer ? serializeOffer(offer) : null,
  };
}

export async function analyzeMercadoLivreExternalLink(externalLink: string) {
  ensureValidUrl(externalLink, "externalLink");

  const catalogProductId = extractCatalogIdFromUrl(externalLink);

  if (!catalogProductId) {
    throw new Error(
      "Não foi possível identificar o catalogProductId no link do Mercado Livre.",
    );
  }

  const requestedItemId = extractItemIdFromUrl(externalLink);

  const requestedWid = extractWidFromUrl(externalLink);

  const catalog = await getCatalogProduct(catalogProductId);

  const offers = await getCatalogOffers(catalogProductId);

  const serializedOffers = offers.results.map(serializeOffer);

  let selectedOffer = null;

  if (serializedOffers.length === 1) {
    selectedOffer = serializedOffers[0];
  }

  return {
    externalLink,
    catalogProductId,
    requestedItemId,
    requestedWid,
    catalogStatus: catalog.status ?? null,
    title: catalog.name ?? "",
    permalink: catalog.permalink ?? null,
    imageUrls: getCatalogImageUrls(catalog),
    offers: serializedOffers,
    selectedOffer,
    requiresOfferSelection: serializedOffers.length > 1,
    noOffersFound: serializedOffers.length === 0,
  };
}

export async function importMercadoLivreProduct(input: ImportInput) {
  ensureValidUrl(input.affiliateUrl, "affiliateUrl");

  ensureValidUrl(input.externalLink, "externalLink");

  const catalogProductId = normalizeString(
    input.catalogProductId,
  ).toUpperCase();

  const itemId = normalizeString(input.itemId).toUpperCase();

  const sellerId = normalizeString(input.sellerId);

  const subcategoryId = normalizeString(input.subcategoryId);

  if (!/^MLB\d+$/i.test(catalogProductId)) {
    throw new Error("catalogProductId inválido.");
  }

  if (!/^MLB\d+$/i.test(itemId)) {
    throw new Error("itemId inválido.");
  }

  if (!/^\d+$/.test(sellerId)) {
    throw new Error("sellerId inválido.");
  }

  const linkCatalogProductId = extractCatalogIdFromUrl(input.externalLink);

  if (linkCatalogProductId && linkCatalogProductId !== catalogProductId) {
    throw new Error(
      "O catalogProductId informado não corresponde ao externalLink.",
    );
  }

  const linkItemId = extractItemIdFromUrl(input.externalLink);

  if (linkItemId && linkItemId !== itemId) {
    throw new Error("O itemId informado não corresponde ao externalLink.");
  }

  const marketplace = await prisma.marketplace.findUnique({
    where: {
      id: MARKETPLACE_ID,
    },
  });

  if (!marketplace) {
    throw new Error("Marketplace do Mercado Livre não encontrado.");
  }

  const subcategory = await prisma.subcategory.findUnique({
    where: {
      id: subcategoryId,
    },
  });

  if (!subcategory) {
    throw new Error("Subcategoria não encontrada.");
  }

  const catalog = await getCatalogProduct(catalogProductId);

  const catalogOffers = await getCatalogOffers(catalogProductId, sellerId);

  const offer = catalogOffers.results.find(
    (candidate) =>
      candidate.item_id === itemId && String(candidate.seller_id) === sellerId,
  );

  if (!offer) {
    throw new Error(
      "A oferta selecionada não pertence ao catálogo informado ou não está disponível no Mercado Livre.",
    );
  }

  const existingProduct = await prisma.product.findFirst({
    where: {
      externalId: itemId,
      marketplaceId: marketplace.id,
    },
  });

  if (existingProduct) {
    throw new Error("Este produto do Mercado Livre já está cadastrado.");
  }

  const existingMarketplaceProduct = await prisma.marketplaceProduct.findFirst({
    where: {
      marketplaceId: marketplace.id,
      itemId,
      sellerId,
    },
  });

  if (existingMarketplaceProduct) {
    throw new Error("Esta oferta do Mercado Livre já está cadastrada.");
  }

  const catalogImages = getCatalogImageUrls(catalog);

  const manualImages = normalizeImages(input.images);

  const manualPrimaryImage = normalizeString(input.imageUrl);

  const allImages = mergeProductImages(
    catalogImages,
    manualImages,
    manualPrimaryImage,
  );

  const primaryImage =
    catalogImages[0] ?? manualPrimaryImage ?? allImages[0] ?? null;

  const automaticTitle = normalizeString(catalog.name);

  const manualTitle = normalizeString(input.title);

  const title =
    automaticTitle || manualTitle || `Produto Mercado Livre ${itemId}`;

  const slug = createProductSlug(title, itemId);

  const description = normalizeDescription(input.description);

  const shortDescription = normalizeNullableString(input.shortDescription);

  const rating = normalizeNumber(input.rating);

  const reviewsCount = normalizeInteger(input.reviewsCount);

  const featured = input.featured ?? false;

  const available = input.available ?? true;

  const active = input.active ?? true;

  const seoTitle = normalizeNullableString(input.seoTitle);

  const seoDescription = normalizeNullableString(input.seoDescription);

  const originalPrice =
    offer.original_price ?? normalizeNumber(input.originalPrice);

  const currency =
    normalizeString(offer.currency_id) ||
    normalizeString(input.currency) ||
    "BRL";

  const now = new Date();

  const product = await prisma.$transaction(
    async (transaction: Prisma.TransactionClient) => {
      const createdProduct = await transaction.product.create({
        data: {
          externalId: itemId,

          title,

          slug,

          description,

          shortDescription,

          imageUrl: primaryImage,

          price: offer.price,

          originalPrice,

          currency,

          rating,

          reviewsCount,

          affiliateUrl: input.affiliateUrl.trim(),

          subcategoryId,

          marketplaceId: marketplace.id,

          featured,

          available,

          active,

          seoTitle,

          seoDescription,

          syncedAt: now,
        },
      });

      if (allImages.length > 0) {
        await transaction.productImage.createMany({
          data: allImages.map((imageUrl, index) => ({
            productId: createdProduct.id,
            imageUrl,
            sortOrder: index,
          })),
        });
      }

      await transaction.marketplaceProduct.create({
        data: {
          productId: createdProduct.id,

          marketplaceId: marketplace.id,

          externalId: itemId,

          catalogProductId,

          itemId,

          sellerId,

          externalLink: input.externalLink.trim(),

          affiliateUrl: input.affiliateUrl.trim(),

          price: offer.price,

          originalPrice,

          currency,

          rating,

          reviewsCount,

          available,

          syncStatus: "SUCCESS",

          lastSyncedAt: now,

          lastSyncError: null,
        },
      });

      return createdProduct;
    },
  );

  return product;
}

export async function recoverLegacyProduct(productId: string) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      marketplace: true,
    },
  });

  if (!product) {
    throw new Error("Produto não encontrado.");
  }

  const marketplaceProduct = await prisma.marketplaceProduct.findUnique({
    where: {
      productId_marketplaceId: {
        productId: product.id,
        marketplaceId: product.marketplaceId,
      },
    },
  });

  if (!marketplaceProduct) {
    throw new Error(
      "Nenhuma oferta de marketplace encontrada para este produto.",
    );
  }

  if (marketplaceProduct.marketplaceId !== MARKETPLACE_ID) {
    throw new Error("O produto não pertence ao Mercado Livre.");
  }

  if (!marketplaceProduct.externalLink) {
    throw new Error("O produto não possui externalLink para recuperação.");
  }

  return {
    product,
    marketplaceProduct,
  };
}

export async function syncMercadoLivreProducts() {
  const marketplaceProducts = await prisma.marketplaceProduct.findMany({
    where: {
      marketplaceId: MARKETPLACE_ID,
      available: true,
    },
    include: {
      product: true,
    },
  });

  const results = [];

  for (const marketplaceProduct of marketplaceProducts) {
    try {
      if (
        !marketplaceProduct.catalogProductId ||
        !marketplaceProduct.itemId ||
        !marketplaceProduct.sellerId
      ) {
        throw new Error("Produto sem catalogProductId, itemId ou sellerId.");
      }

      const catalogOffers = await getCatalogOffers(
        marketplaceProduct.catalogProductId,
        marketplaceProduct.sellerId,
      );

      const offer = catalogOffers.results.find(
        (candidate) =>
          candidate.item_id === marketplaceProduct.itemId &&
          String(candidate.seller_id) === marketplaceProduct.sellerId,
      );

      if (!offer) {
        await prisma.marketplaceProduct.update({
          where: {
            id: marketplaceProduct.id,
          },
          data: {
            available: false,
            syncStatus: "ERROR",
            lastSyncError: "Oferta não encontrada no Mercado Livre.",
            lastSyncedAt: new Date(),
          },
        });

        results.push({
          id: marketplaceProduct.id,
          productId: marketplaceProduct.productId,
          status: "ERROR",
          message: "Oferta não encontrada no Mercado Livre.",
        });

        continue;
      }

      const originalPrice = offer.original_price ?? null;

      await prisma.$transaction([
        prisma.product.update({
          where: {
            id: marketplaceProduct.productId,
          },
          data: {
            price: offer.price,
            originalPrice,
            currency: offer.currency_id,
            available: marketplaceProduct.available,
            syncedAt: new Date(),
          },
        }),

        prisma.marketplaceProduct.update({
          where: {
            id: marketplaceProduct.id,
          },
          data: {
            price: offer.price,
            originalPrice,
            currency: offer.currency_id,
            available: true,
            syncStatus: "SUCCESS",
            lastSyncError: null,
            lastSyncedAt: new Date(),
          },
        }),
      ]);

      results.push({
        id: marketplaceProduct.id,
        productId: marketplaceProduct.productId,
        status: "SUCCESS",
        price: offer.price,
        originalPrice,
        currency: offer.currency_id,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao sincronizar.";

      await prisma.marketplaceProduct.update({
        where: {
          id: marketplaceProduct.id,
        },
        data: {
          syncStatus: "ERROR",
          lastSyncError: message,
          lastSyncedAt: new Date(),
        },
      });

      results.push({
        id: marketplaceProduct.id,
        productId: marketplaceProduct.productId,
        status: "ERROR",
        message,
      });
    }
  }

  return results;
}

export async function getMercadoLivreProducts(search?: string) {
  const products = await prisma.marketplaceProduct.findMany({
    where: {
      marketplaceId: MARKETPLACE_ID,

      ...(search
        ? {
            OR: [
              {
                externalId: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                catalogProductId: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                itemId: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                sellerId: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                product: {
                  title: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    },

    include: {
      product: {
        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
          subcategory: true,
        },
      },
      marketplace: true,
    },

    orderBy: {
      updatedAt: "desc",
    },
  });

  return products;
}
