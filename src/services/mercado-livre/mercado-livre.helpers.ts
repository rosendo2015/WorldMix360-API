import type {
  CatalogProduct,
  Offer,
  SerializedOffer,
} from "./mercado-livre.types";

export function ensureValidUrl(value: string, fieldName: string): string {
  const normalized = value?.trim();

  if (!normalized) {
    throw new Error(`${fieldName} é obrigatório.`);
  }

  let url: URL;

  try {
    url = new URL(normalized);
  } catch {
    throw new Error(`${fieldName} deve ser uma URL válida.`);
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`${fieldName} deve utilizar HTTP ou HTTPS.`);
  }

  return normalized;
}

export function normalizeString(value: unknown, fieldName: string): string {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    throw new Error(`${fieldName} é obrigatório.`);
  }

  return normalized;
}

export function normalizeNullableString(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value).trim();

  return normalized || null;
}

export function normalizeDescription(value: unknown): string | null {
  const normalized = normalizeNullableString(value);

  if (!normalized) {
    return null;
  }

  return normalized.replace(/\s+/g, " ").trim();
}

export function normalizeNumber(value: unknown, fieldName: string): number {
  const numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numberValue)) {
    throw new Error(`${fieldName} deve ser um número válido.`);
  }

  return numberValue;
}

export function normalizeInteger(value: unknown, fieldName: string): number {
  const numberValue = normalizeNumber(value, fieldName);

  if (!Number.isInteger(numberValue)) {
    throw new Error(`${fieldName} deve ser um número inteiro.`);
  }

  return numberValue;
}

function getHashParams(url: URL): URLSearchParams {
  const hash = url.hash.replace(/^#/, "").trim();

  if (!hash) {
    return new URLSearchParams();
  }

  return new URLSearchParams(hash);
}

function extractItemIdFromPdpFilters(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const match = value.match(/item_id\s*:\s*(MLB\d{8,})/i);

  return match?.[1]?.toUpperCase() ?? null;
}

export function extractCatalogIdFromUrl(value: string): string | null {
  const url = new URL(value);

  const match = url.pathname.match(/\/p\/(MLB\d+)/i);

  return match?.[1]?.toUpperCase() ?? null;
}

export function extractUserProductIdFromUrl(value: string): string | null {
  const url = new URL(value);

  const match = url.pathname.match(/\/up\/(ML[A-Z]U\d+)/i);

  return match?.[1]?.toUpperCase() ?? null;
}

export function extractWidFromUrl(value: string): string | null {
  const url = new URL(value);

  const queryWid = url.searchParams.get("wid");

  if (queryWid) {
    const match = queryWid.match(/MLB\d{8,}/i);

    if (match) {
      return match[0].toUpperCase();
    }
  }

  const hashParams = getHashParams(url);
  const hashWid = hashParams.get("wid");

  if (hashWid) {
    const match = hashWid.match(/MLB\d{8,}/i);

    if (match) {
      return match[0].toUpperCase();
    }
  }

  return null;
}

export function extractItemIdFromUrl(value: string): string | null {
  const url = new URL(value);

  const catalogProductId = extractCatalogIdFromUrl(value);

  const queryWid = url.searchParams.get("wid");

  if (queryWid) {
    const match = queryWid.match(/MLB\d{8,}/i);

    if (match) {
      return match[0].toUpperCase();
    }
  }

  const queryPdpFilters = url.searchParams.get("pdp_filters");
  const queryPdpItem = extractItemIdFromPdpFilters(queryPdpFilters);

  if (queryPdpItem) {
    return queryPdpItem;
  }

  const hashParams = getHashParams(url);

  const hashWid = hashParams.get("wid");

  if (hashWid) {
    const match = hashWid.match(/MLB\d{8,}/i);

    if (match) {
      return match[0].toUpperCase();
    }
  }

  const hashPdpFilters = hashParams.get("pdp_filters");
  const hashPdpItem = extractItemIdFromPdpFilters(hashPdpFilters);

  if (hashPdpItem) {
    return hashPdpItem;
  }

  const pathnameMatch = url.pathname.match(/\/(MLB\d{8,})(?:\/|$)/i);

  if (pathnameMatch) {
    const pathnameId = pathnameMatch[1]?.toUpperCase();

    if (pathnameId && pathnameId !== catalogProductId) {
      return pathnameId;
    }
  }

  return null;
}

export function serializeOffer(offer: Offer): SerializedOffer {
  return {
    itemId: offer.item_id,
    sellerId: String(offer.seller_id),
    title: offer.title ?? null,
    price: offer.price ?? null,
    originalPrice: offer.original_price ?? null,
    currency: offer.currency_id ?? null,
    categoryId: offer.category_id ?? null,
    warranty: offer.warranty ?? null,
    condition: offer.condition ?? null,
    listingTypeId: offer.listing_type_id ?? null,
    officialStoreId:
      offer.official_store_id !== undefined && offer.official_store_id !== null
        ? String(offer.official_store_id)
        : null,
    freeShipping: Boolean(offer.shipping?.free_shipping),
    logisticType: offer.shipping?.logistic_type ?? null,
    userProductId: offer.user_product_id ?? null,
    available: offer.available !== false,
    permalink: offer.permalink ?? null,
    thumbnail: offer.thumbnail ?? null,
    catalogProductId: offer.catalog_product_id ?? null,
  };
}

export function createProductSlug(title: string): string {
  const normalized = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `produto-${Date.now()}`;
}

export function getCatalogImageUrls(catalog: CatalogProduct): string[] {
  return (catalog.pictures ?? [])
    .map((picture) => picture.secure_url ?? picture.url ?? "")
    .filter(Boolean);
}

export function normalizeImages(
  images: Array<{
    imageUrl: string;
    sortOrder?: number;
  }> = [],
): Array<{
  imageUrl: string;
  sortOrder: number;
}> {
  return images
    .map((image, index) => ({
      imageUrl: image.imageUrl.trim(),
      sortOrder: image.sortOrder !== undefined ? image.sortOrder : index,
    }))
    .filter((image) => Boolean(image.imageUrl));
}

export function mergeProductImages(
  catalogImages: string[],
  manualImages: Array<{
    imageUrl: string;
    sortOrder?: number;
  }> = [],
): Array<{
  imageUrl: string;
  sortOrder: number;
}> {
  const merged: string[] = [];
  const seen = new Set<string>();

  for (const imageUrl of [
    ...catalogImages,
    ...manualImages.map((image) => image.imageUrl),
  ]) {
    const normalized = imageUrl.trim();

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    merged.push(normalized);
  }

  return merged.map((imageUrl, index) => ({
    imageUrl,
    sortOrder: index,
  }));
}
