import { load } from "cheerio";
import { chromium } from "playwright";
import { prisma } from "@/database/prisma";
import type { Prisma } from "@/generated/prisma/client";
import {
  getCatalogOffers,
  getCatalogOffersBySeller,
  getCatalogProduct,
  getMercadoLivreItem,
} from "./mercado-livre.api";
import {
  connectMercadoLivre,
  getMercadoLivreAuthorizationUrl,
  MARKETPLACE_ID,
} from "./mercado-livre.auth";

import {
  createProductSlug,
  ensureValidUrl,
  extractCatalogIdFromUrl,
  extractItemIdFromUrl,
  extractUserProductIdFromUrl,
  extractWidFromUrl,
  getCatalogImageUrls,
  mergeProductImages,
  normalizeDescription,
  normalizeImages,
  normalizeInteger,
  normalizeNullableString,
  normalizeNumber,
  normalizeString,
  serializeOffer,
} from "./mercado-livre.helpers";

import type {
  ImportInput,
  ResolvedMercadoLivreLink,
  UpdateMercadoLivreProductOfferInput,
} from "./mercado-livre.types";

export { connectMercadoLivre, getMercadoLivreAuthorizationUrl };

async function resolveMercadoLivreExternalLink(
  externalLink: string,
): Promise<ResolvedMercadoLivreLink> {
  ensureValidUrl(externalLink, "externalLink");

  const directCatalogProductId = extractCatalogIdFromUrl(externalLink);

  const userProductId = extractUserProductIdFromUrl(externalLink);

  const requestedWid = extractWidFromUrl(externalLink);

  let requestedItemId = extractItemIdFromUrl(externalLink);

  let catalogProductId = directCatalogProductId;

  if (!requestedItemId && requestedWid) {
    requestedItemId = requestedWid;
  }

  if (!catalogProductId && requestedItemId) {
    const item = await getMercadoLivreItem(requestedItemId);

    catalogProductId = item.catalog_product_id?.trim().toUpperCase() ?? null;
  }

  if (!catalogProductId) {
    if (userProductId) {
      throw new Error(
        `O link contém o User Product ${userProductId}, mas não foi possível identificar um catalogProductId através do item associado.`,
      );
    }

    throw new Error(
      "Não foi possível identificar o catalogProductId no link do Mercado Livre.",
    );
  }

  return {
    externalLink,
    catalogProductId,
    userProductId,
    requestedItemId,
    requestedWid,
  };
}

export async function findCatalogOfferByItem(
  catalogProductId: string,
  sellerId: string,
  itemId: string,
) {
  const offers = await getCatalogOffersBySeller(catalogProductId, sellerId);

  return (
    offers.find(
      (offer) =>
        offer.item_id === itemId && String(offer.seller_id) === sellerId,
    ) ?? null
  );
}

export async function analyzeMercadoLivrePublicPage(url: string) {
  ensureValidUrl(url, "url");

  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36",
      viewport: {
        width: 1366,
        height: 768,
      },
      locale: "pt-BR",
    });

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.waitForTimeout(3000);

    const finalUrl = page.url();

    const html = await page.content();

    const $ = load(html);

    const title =
      $("title").first().text().trim() ||
      $('meta[property="og:title"]').attr("content")?.trim() ||
      null;

    const description =
      $('meta[name="description"]').attr("content")?.trim() ||
      $('meta[property="og:description"]').attr("content")?.trim() ||
      null;

    const canonical = $('link[rel="canonical"]').attr("href")?.trim() || null;

    const ogImage =
      $('meta[property="og:image"]').attr("content")?.trim() || null;

    const ogUrl = $('meta[property="og:url"]').attr("content")?.trim() || null;

    const ogType =
      $('meta[property="og:type"]').attr("content")?.trim() || null;

    const meta = {
      title,
      description,
      canonical,
      ogImage,
      ogUrl,
      ogType,
    };

    const jsonLd: unknown[] = [];

    $('script[type="application/ld+json"]').each((_, element) => {
      const content = $(element).text().trim();

      if (!content) {
        return;
      }

      try {
        jsonLd.push(JSON.parse(content));
      } catch {
        jsonLd.push({
          parseError: true,
          raw: content,
        });
      }
    });

    const images = $("img")
      .map((_, element) => ({
        src:
          $(element).attr("src")?.trim() ||
          $(element).attr("data-src")?.trim() ||
          $(element).attr("data-lazy-src")?.trim() ||
          null,

        srcset: $(element).attr("srcset")?.trim() || null,

        alt: $(element).attr("alt")?.trim() || null,
      }))
      .get()
      .filter((image) => image.src || image.srcset);

    const links = $("a[href]")
      .map((_, element) => ({
        href: $(element).attr("href")?.trim() || null,
        text: $(element).text().replace(/\s+/g, " ").trim() || null,
      }))
      .get()
      .filter((link) => link.href);

    const bodyText = $("body").text().replace(/\s+/g, " ").trim();

    const extractedItemIds = Array.from(
      new Set(
        `${url}\n${finalUrl}\n${html}\n${bodyText}`.match(/\bMLB\d{6,}\b/gi) ??
          [],
      ),
    ).map((itemId) => itemId.toUpperCase());

    const extractedCatalogIds = Array.from(
      new Set(
        `${url}\n${finalUrl}\n${html}\n${bodyText}`.match(/\bMLB\d{6,}\b/gi) ??
          [],
      ),
    ).map((id) => id.toUpperCase());

    return {
      requestedUrl: url,

      finalUrl,

      httpStatus: 200,

      page: {
        title,
        description,
        canonical,
      },

      openGraph: {
        title: $('meta[property="og:title"]').attr("content")?.trim() || null,

        description:
          $('meta[property="og:description"]').attr("content")?.trim() || null,

        image: ogImage,

        url: ogUrl,

        type: ogType,
      },

      extractedIds: {
        itemIds: extractedItemIds,
        catalogProductIds: extractedCatalogIds,
      },

      jsonLd,

      images,

      links,

      bodyText,

      htmlLength: html.length,
    };
  } finally {
    await browser.close();
  }
}

export async function analyzeMercadoLivreExternalLink(externalLink: string) {
  const resolved = await resolveMercadoLivreExternalLink(externalLink);

  const catalog = await getCatalogProduct(resolved.catalogProductId);

  /*
   * Primeira consulta das ofertas do catálogo.
   */
  let offersResponse = await getCatalogOffers(resolved.catalogProductId);

  let serializedOffers = offersResponse.results.map(serializeOffer);

  let availableOffers = serializedOffers.filter(
    (offer) => offer.available !== false,
  );

  /*
   * Se nenhuma oferta foi encontrada, fazemos uma segunda
   * consulta ao mesmo endpoint do Mercado Livre.
   */
  if (availableOffers.length === 0) {
    offersResponse = await getCatalogOffers(resolved.catalogProductId);

    serializedOffers = offersResponse.results.map(serializeOffer);

    availableOffers = serializedOffers.filter(
      (offer) => offer.available !== false,
    );
  }

  /*
   * Nunca selecionamos automaticamente uma oferta.
   *
   * Mesmo que exista apenas uma, ela precisa ser exibida
   * para o usuário confirmar.
   */
  const selectedOffer = null;

  return {
    externalLink,

    catalogProductId: resolved.catalogProductId,

    userProductId: resolved.userProductId,

    requestedItemId: resolved.requestedItemId,

    requestedWid: resolved.requestedWid,

    catalogStatus: catalog.status ?? null,

    title: catalog.name ?? "",

    permalink: catalog.permalink ?? null,

    imageUrls: getCatalogImageUrls(catalog),

    offers: availableOffers,

    selectedOffer,

    /*
     * Uma única oferta também exige confirmação.
     */
    requiresOfferSelection: availableOffers.length > 0,

    /*
     * Só será true depois que as duas consultas
     * não encontrarem nenhuma oferta válida.
     */
    noOffersFound: availableOffers.length === 0,
  };
}

export async function importMercadoLivreProduct(input: ImportInput) {
  const affiliateUrl = ensureValidUrl(input.affiliateUrl, "affiliateUrl");

  const externalLink = ensureValidUrl(input.externalLink, "externalLink");

  const catalogProductId = normalizeString(
    input.catalogProductId,
    "catalogProductId",
  ).toUpperCase();

  const itemId = normalizeString(input.itemId, "itemId").toUpperCase();

  const sellerId = normalizeString(input.sellerId, "sellerId");

  const subcategoryId = normalizeString(input.subcategoryId, "subcategoryId");

  if (!/^MLB\d+$/.test(catalogProductId)) {
    throw new Error("catalogProductId inválido.");
  }

  if (!/^MLB\d+$/.test(itemId)) {
    throw new Error("itemId inválido.");
  }

  if (!/^\d+$/.test(sellerId)) {
    throw new Error("sellerId inválido.");
  }

  const resolved = await resolveMercadoLivreExternalLink(externalLink);

  if (resolved.catalogProductId !== catalogProductId) {
    throw new Error(
      "O catalogProductId informado não corresponde ao produto do link externo.",
    );
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

  const offer = await findCatalogOfferByItem(
    catalogProductId,
    sellerId,
    itemId,
  );

  if (!offer) {
    throw new Error(
      "A oferta selecionada não foi encontrada para o seller informado.",
    );
  }

  /*
   * A oferta existe, mas o Mercado Livre informou
   * explicitamente que ela está indisponível.
   *
   * Não permitimos o cadastro como produto disponível.
   */
  if (offer.available === false) {
    throw new Error(
      "A oferta selecionada está indisponível no Mercado Livre e não pode ser cadastrada.",
    );
  }

  const existingProduct = await prisma.product.findFirst({
    where: {
      externalId: itemId,
      marketplaceId: MARKETPLACE_ID,
    },
  });

  if (existingProduct) {
    throw new Error("Este item do Mercado Livre já está cadastrado.");
  }

  const existingMarketplaceProduct = await prisma.marketplaceProduct.findFirst({
    where: {
      marketplaceId: MARKETPLACE_ID,
      itemId,
      sellerId,
    },
  });

  if (existingMarketplaceProduct) {
    throw new Error("Esta oferta do Mercado Livre já está cadastrada.");
  }

  const catalogImages = getCatalogImageUrls(catalog);

  const manualImages = normalizeImages(input.images ?? []);

  const allImages = mergeProductImages(catalogImages, manualImages);

  const primaryImage =
    input.imageUrl?.trim() || allImages[0]?.imageUrl || catalogImages[0] || "";

  if (!primaryImage) {
    throw new Error(
      "Não foi possível determinar a imagem principal do produto.",
    );
  }

  const title =
    normalizeNullableString(catalog.name) ??
    normalizeNullableString(input.title) ??
    "Produto Mercado Livre";

  const description = normalizeDescription(input.description);

  const shortDescription = normalizeDescription(input.shortDescription);

  const price = normalizeNumber(offer.price, "price");

  const originalPrice =
    offer.original_price !== undefined && offer.original_price !== null
      ? normalizeNumber(offer.original_price, "originalPrice")
      : input.originalPrice !== undefined && input.originalPrice !== null
        ? normalizeNumber(input.originalPrice, "originalPrice")
        : null;

  const currency = normalizeString(
    offer.currency_id || input.currency || "BRL",
    "currency",
  );

  const rating =
    input.rating !== undefined && input.rating !== null
      ? normalizeNumber(input.rating, "rating")
      : null;

  const reviewsCount =
    input.reviewsCount !== undefined
      ? normalizeInteger(input.reviewsCount, "reviewsCount")
      : 0;

  const slug = createProductSlug(title);

  const productData: Prisma.ProductCreateInput = {
    externalId: itemId,

    title,
    slug,

    description,
    shortDescription,

    imageUrl: primaryImage,

    price,
    originalPrice,
    currency,

    rating,
    reviewsCount,

    affiliateUrl,

    /*
     * Como a oferta foi validada acima e não está
     * explicitamente indisponível, o cadastro começa
     * como disponível.
     */
    available: true,

    destaque: input.destaque ?? false,

    bestSeller: input.bestSeller ?? false,

    active: input.active ?? true,

    seoTitle: input.seoTitle?.trim() || null,

    seoDescription: input.seoDescription?.trim() || null,

    subcategory: {
      connect: {
        id: subcategoryId,
      },
    },

    marketplace: {
      connect: {
        id: MARKETPLACE_ID,
      },
    },
  };

  const product = await prisma.$transaction(async (transaction) => {
    const createdProduct = await transaction.product.create({
      data: productData,
    });

    if (allImages.length > 0) {
      await transaction.productImage.createMany({
        data: allImages.map((image) => ({
          productId: createdProduct.id,
          imageUrl: image.imageUrl,
          sortOrder: image.sortOrder,
        })),
      });
    }

    await transaction.marketplaceProduct.create({
      data: {
        productId: createdProduct.id,

        marketplaceId: MARKETPLACE_ID,

        externalId: itemId,

        catalogProductId,

        itemId,

        sellerId,

        externalLink,

        affiliateUrl,

        price,

        originalPrice,

        currency,

        available: true,

        syncStatus: "SUCCESS",

        lastSyncedAt: new Date(),

        lastSyncError: null,
      },
    });

    return createdProduct;
  });

  return prisma.product.findUnique({
    where: {
      id: product.id,
    },
    include: {
      subcategory: {
        include: {
          category: true,
        },
      },
      images: true,
      marketplaceProducts: true,
    },
  });
}

export async function recoverLegacyProduct(productId: string) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      marketplaceProducts: true,
    },
  });

  if (!product) {
    throw new Error("Produto não encontrado.");
  }

  const marketplaceProduct = product.marketplaceProducts.find(
    (item) => item.marketplaceId === MARKETPLACE_ID,
  );

  if (!marketplaceProduct) {
    throw new Error("Relação com o Mercado Livre não encontrada.");
  }

  return product;
}

export async function syncMercadoLivreProducts() {
  const marketplaceProducts = await prisma.marketplaceProduct.findMany({
    where: {
      marketplaceId: MARKETPLACE_ID,
    },
    include: {
      product: true,
    },
  });

  const results: Array<{
    id: string;
    productId: string;
    status: string;
    error?: string;
    itemId?: string | null;
    sellerId?: string | null;
    previousPrice?: number | null;
    newPrice?: number | null;
    previousOriginalPrice?: number | null;
    newOriginalPrice?: number | null;
  }> = [];

  for (const marketplaceProduct of marketplaceProducts) {
    try {
      if (
        !marketplaceProduct.catalogProductId ||
        !marketplaceProduct.itemId ||
        !marketplaceProduct.sellerId
      ) {
        throw new Error("Dados insuficientes para sincronização.");
      }

      const previousPrice =
        marketplaceProduct.price !== null
          ? Number(marketplaceProduct.price)
          : null;

      const previousOriginalPrice =
        marketplaceProduct.originalPrice !== null
          ? Number(marketplaceProduct.originalPrice)
          : null;

      await prisma.marketplaceProduct.update({
        where: { id: marketplaceProduct.id },
        data: {
          syncStatus: "SYNCING",
          lastSyncError: null,
        },
      });

      const offer = await findCatalogOfferByItem(
        marketplaceProduct.catalogProductId,
        marketplaceProduct.sellerId,
        marketplaceProduct.itemId,
      );

      if (!offer || offer.available === false) {
        await prisma.$transaction([
          prisma.product.update({
            where: {
              id: marketplaceProduct.productId,
            },
            data: {
              available: false,
              syncedAt: new Date(),
            },
          }),

          prisma.marketplaceProduct.update({
            where: {
              id: marketplaceProduct.id,
            },
            data: {
              available: false,
              syncStatus: "UNAVAILABLE",
              lastSyncedAt: new Date(),
              lastSyncError: "Oferta não encontrada no Mercado Livre.",
            },
          }),
        ]);

        results.push({
          id: marketplaceProduct.id,
          productId: marketplaceProduct.productId,
          status: "UNAVAILABLE",
        });

        continue;
      }

      const price = normalizeNumber(offer.price, "price");

      const originalPrice = offer.original_price ?? null;

      const currency = offer.currency_id ?? "BRL";

      await prisma.$transaction([
        prisma.product.update({
          where: {
            id: marketplaceProduct.productId,
          },
          data: {
            price,
            originalPrice,
            currency,
            available: true,
            syncedAt: new Date(),
          },
        }),

        prisma.marketplaceProduct.update({
          where: {
            id: marketplaceProduct.id,
          },
          data: {
            price,
            originalPrice,
            currency,
            available: true,
            syncStatus: "SUCCESS",
            lastSyncedAt: new Date(),
            lastSyncError: null,
          },
        }),
      ]);

      results.push({
        id: marketplaceProduct.id,
        productId: marketplaceProduct.productId,
        status: "SUCCESS",
        itemId: marketplaceProduct.itemId,
        sellerId: marketplaceProduct.sellerId,
        previousPrice,
        newPrice: price,
        previousOriginalPrice,
        newOriginalPrice: originalPrice,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido.";

      await prisma.marketplaceProduct.update({
        where: {
          id: marketplaceProduct.id,
        },
        data: {
          syncStatus: "ERROR",
          lastSyncedAt: new Date(),
          lastSyncError: message,
        },
      });

      results.push({
        id: marketplaceProduct.id,
        productId: marketplaceProduct.productId,
        status: "ERROR",
        error: message,
      });
    }
  }

  return {
    message: "Produtos do Mercado Livre sincronizados com sucesso",
    products: results,
  };
}

export async function updateMercadoLivreProductOffer(
  productId: string,
  input: UpdateMercadoLivreProductOfferInput,
) {
  const externalLink = ensureValidUrl(input.externalLink, "externalLink");

  const catalogProductId = normalizeString(
    input.catalogProductId,
    "catalogProductId",
  ).toUpperCase();

  const itemId = normalizeString(input.itemId, "itemId").toUpperCase();

  const sellerId = normalizeString(input.sellerId, "sellerId");

  const resolved = await resolveMercadoLivreExternalLink(externalLink);

  if (resolved.catalogProductId !== catalogProductId) {
    throw new Error(
      "O catalogProductId informado não corresponde ao produto do link externo.",
    );
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      marketplaceProducts: true,
    },
  });

  if (!product) {
    throw new Error("Produto não encontrado.");
  }

  const marketplaceProduct = product.marketplaceProducts.find(
    (item) => item.marketplaceId === MARKETPLACE_ID,
  );

  const offer = await findCatalogOfferByItem(
    catalogProductId,
    sellerId,
    itemId,
  );

  if (!offer) {
    throw new Error("A oferta selecionada não foi encontrada.");
  }

  /*
   * A oferta ainda existe na resposta da API, mas está
   * explicitamente marcada como indisponível.
   *
   * Nesse caso a atualização não deve transformar o
   * produto em SUCCESS/disponível.
   */
  if (offer.available === false) {
    throw new Error(
      "A oferta selecionada está indisponível no Mercado Livre e não pode ser vinculada ao produto.",
    );
  }

  const duplicateOffer = await prisma.marketplaceProduct.findFirst({
    where: {
      marketplaceId: MARKETPLACE_ID,
      itemId,
      sellerId,
      ...(marketplaceProduct
        ? {
            id: {
              not: marketplaceProduct.id,
            },
          }
        : {}),
    },
  });

  if (duplicateOffer) {
    throw new Error("Esta oferta já está vinculada a outro produto.");
  }

  const price = normalizeNumber(offer.price, "price");

  const originalPrice = offer.original_price ?? null;

  const previousPrice = marketplaceProduct?.price ?? null;

  const previousOriginalPrice = marketplaceProduct?.originalPrice ?? null;

  const currency = offer.currency_id ?? "BRL";

  await prisma.$transaction(async (transaction) => {
    await transaction.product.update({
      where: {
        id: productId,
      },
      data: {
        externalId: itemId,

        price,

        originalPrice,

        currency,

        available: true,

        syncedAt: new Date(),
      },
    });

    if (marketplaceProduct) {
      await transaction.marketplaceProduct.update({
        where: {
          id: marketplaceProduct.id,
        },
        data: {
          externalId: itemId,

          catalogProductId,

          itemId,

          sellerId,

          externalLink,

          price,

          originalPrice,

          currency,

          available: true,

          syncStatus: "SUCCESS",

          lastSyncedAt: new Date(),

          lastSyncError: null,
        },
      });
    } else {
      await transaction.marketplaceProduct.create({
        data: {
          productId,

          marketplaceId: MARKETPLACE_ID,

          externalId: itemId,

          catalogProductId,

          itemId,

          sellerId,

          externalLink,

          affiliateUrl: product.affiliateUrl,

          price,

          originalPrice,

          currency,

          available: true,

          syncStatus: "SUCCESS",

          lastSyncedAt: new Date(),

          lastSyncError: null,
        },
      });
    }
  });

  return prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      subcategory: {
        include: {
          category: true,
        },
      },
      images: true,
      marketplaceProducts: true,
    },
  });
}

export async function getMercadoLivreProducts(search?: string) {
  const normalizedSearch = search?.trim();

  return prisma.product.findMany({
    where: {
      marketplaceId: MARKETPLACE_ID,

      ...(normalizedSearch
        ? {
            OR: [
              {
                title: {
                  contains: normalizedSearch,
                  mode: "insensitive",
                },
              },
              {
                externalId: {
                  contains: normalizedSearch,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },

    include: {
      subcategory: {
        include: {
          category: true,
        },
      },
      images: true,
      marketplaceProducts: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}
