export type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
  user_id?: number;
  refresh_token: string;
};

export type CatalogProduct = {
  id: string;
  status?: string;
  name?: string;
  domain_id?: string;
  permalink?: string;
  pictures?: Array<{
    id?: string;
    url?: string;
    secure_url?: string;
  }>;
};

export type MercadoLivreItem = {
  id: string;
  title?: string;
  catalog_product_id?: string | null;
  category_id?: string | null;
  price?: number | null;
  original_price?: number | null;
  currency_id?: string | null;
  available_quantity?: number | null;
  condition?: string | null;
  permalink?: string | null;
  thumbnail?: string | null;
  pictures?: Array<{
    id?: string;
    url?: string;
    secure_url?: string;
  }>;
  seller?: {
    id?: number | string;
  };
};

export type Offer = {
  item_id: string;
  seller_id: string | number;
  title?: string;
  price?: number;
  original_price?: number;
  currency_id?: string;
  available?: boolean;
  permalink?: string;
  thumbnail?: string;
  catalog_product_id?: string | null;
  category_id?: string | null;
  warranty?: string | null;
  condition?: string | null;
  listing_type_id?: string | null;
  official_store_id?: string | number | null;
  shipping?: {
    free_shipping?: boolean;
    logistic_type?: string | null;
  } | null;
  user_product_id?: string | null;
};

export type ImportImageInput = {
  imageUrl: string;
  sortOrder?: number;
};

export type ImportInput = {
  affiliateUrl: string;
  externalLink: string;
  catalogProductId: string;
  itemId: string;
  sellerId: string;
  subcategoryId: string;
  title: string;
  description?: string;
  shortDescription?: string;
  imageUrl?: string;
  images?: ImportImageInput[];
  price?: number;
  originalPrice?: number;
  currency?: string;
  rating?: number;
  reviewsCount?: number;
  featured?: boolean;
  destaque?: boolean;
  bestSeller?: boolean;
  available?: boolean;
  active?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export type UpdateMercadoLivreProductOfferInput = {
  externalLink: string;
  catalogProductId: string;
  itemId: string;
  sellerId: string;
};

export type SerializedOffer = {
  itemId: string;
  sellerId: string;
  title: string | null;
  price: number | null;
  originalPrice: number | null;
  currency: string | null;
  categoryId: string | null;
  warranty: string | null;
  condition: string | null;
  listingTypeId: string | null;
  officialStoreId: string | null;
  freeShipping: boolean;
  logisticType: string | null;
  userProductId: string | null;
  available: boolean;
  permalink: string | null;
  thumbnail: string | null;
  catalogProductId: string | null;
};

export type ResolvedMercadoLivreLink = {
  externalLink: string;
  catalogProductId: string;
  userProductId: string | null;
  requestedItemId: string | null;
  requestedWid: string | null;
};
