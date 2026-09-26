import { API_URL, ensureMercadoLivreAccessToken } from "./mercado-livre.auth";

import type {
  CatalogProduct,
  MercadoLivreItem,
  Offer,
} from "./mercado-livre.types";

export async function mercadoLivreRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await ensureMercadoLivreAccessToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`Mercado Livre API ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export async function getCatalogProduct(
  catalogProductId: string,
): Promise<CatalogProduct> {
  return mercadoLivreRequest<CatalogProduct>(`/products/${catalogProductId}`);
}

export async function getCatalogOffers(catalogProductId: string): Promise<{
  results: Offer[];
}> {
  return mercadoLivreRequest<{
    results: Offer[];
  }>(`/products/${catalogProductId}/items`);
}

export async function getMercadoLivreItem(
  itemId: string,
): Promise<MercadoLivreItem> {
  return mercadoLivreRequest<MercadoLivreItem>(`/items/${itemId}`);
}

export async function getCatalogOffersBySeller(
  catalogProductId: string,
  sellerId: string,
): Promise<Offer[]> {
  const response = await getCatalogOffers(catalogProductId);

  return response.results.filter(
    (offer) => String(offer.seller_id) === sellerId,
  );
}
