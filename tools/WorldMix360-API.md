## package.json

```json
{
  "name": "worldmix360-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "tsx --watch -r tsconfig-paths/register src/server.ts",
    "generate-md": "tsx tools/generate-md.ts",
    "db:migrate": "prisma migrate deploy",
    "db:dev": "prisma migrate dev",
    "db:studio": "prisma studio",
    "build": "tsc && tsc-alias --resolve-full-paths",
    "start": "node dist/src/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "@prisma/adapter-pg": "^7.10.0",
    "@prisma/client": "^7.10.0",
    "bcrypt": "^6.0.0",
    "cheerio": "^1.2.0",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.23.0",
    "playwright": "^1.63.0",
    "tsconfig-paths": "^4.2.0",
    "zod": "^4.5.4"
  },
  "devDependencies": {
    "@types/bcrypt": "^6.0.0",
    "@types/express": "^5.0.6",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/node": "^26.4.0",
    "@types/pg": "^8.23.1",
    "prisma": "^7.10.0",
    "ts-node": "^10.9.2",
    "tsc-alias": "^1.9.3",
    "tsx": "^4.23.13",
    "typescript": "^7.0.2"
  }
}
```

## prisma7.config.ts

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

## README.md

# WorldMix360 API

API Express + TypeScript + Prisma, preparada para usar PostgreSQL local ou hospedado.

## Desenvolvimento local

Requisitos: Node.js 20+ e PostgreSQL acessível.

Com Docker Desktop instalado e iniciado:

```bash
docker compose up -d
npm install
npx prisma generate
npm run db:dev
npm run dev
```

A API ficará em `http://localhost:3333` e o Studio em:

```bash
npm run db:studio
```

Se o Docker não estiver disponível, configure o `DATABASE_URL` no `.env` com a URL externa de qualquer PostgreSQL. O código não depende de Docker.

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

- `DATABASE_URL`: URL do PostgreSQL. Em provedores externos, use a URL pública e `sslmode=require` quando exigido.
- `JWT_SECRET`: segredo forte para as sessões da API.
- `MELI_CLIENT_ID`, `MELI_CLIENT_SECRET` e `MELI_REDIRECT_URI`: credenciais OAuth do Mercado Livre.
- `WEB_URL` e `CORS_ORIGIN`: URL pública do frontend.
- `PRODUCT_SYNC_SECRET`: segredo usado no header `x-sync-token` para sincronizar produtos.

## Produção

O provedor deve executar:

```bash
npm ci
npx prisma generate
npm run db:migrate
npm run build
npm start
```

O servidor usa a variável `PORT` fornecida pelo provedor e, caso ela não exista, usa `3333`.

No Render, o arquivo `render.yaml` já define esses comandos. Em Hostinger ou outro VPS, use os mesmos comandos em um serviço Node, configure as variáveis no painel e aponte `DATABASE_URL` para o PostgreSQL hospedado.

## Endpoints principais

```text
GET  /health
GET  /mercado-livre/authorize
GET  /mercado-livre/callback
GET  /products
POST /products/sync  (header x-sync-token)
```

## skills-lock.json

```json
{
  "version": 1,
  "skills": {
    "prisma-cli": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-cli/SKILL.md",
      "computedHash": "b92e55aef78f6796d81433c44738a6733211a04c16e65cbad6d42c5f71092aab"
    },
    "prisma-client-api": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-client-api/SKILL.md",
      "computedHash": "5dcc0793337151efa73a444e5adbc7e1c24180778e83b4fe94c9109c391bd333"
    },
    "prisma-compute": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-compute/SKILL.md",
      "computedHash": "fbbdcf3e01ed876113d18804d38d17359d9f7ba7a4bd353193673d5924f19818"
    },
    "prisma-database-setup": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-database-setup/SKILL.md",
      "computedHash": "0911d9454bd48df3badd23a50fd90a280eabb15dcbd472c14e7b729075dadefb"
    },
    "prisma-driver-adapter-implementation": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-driver-adapter-implementation/SKILL.md",
      "computedHash": "07484627aea6cce4d0f94b4090ff9acc0caa7e104f9988b95abecf80132f4103"
    },
    "prisma-mongodb-upgrade": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-mongodb-upgrade/SKILL.md",
      "computedHash": "f9ba440e88ca4cec9801d04762296e29e99ca08cb8a8156e4f783ecf90279c8f"
    },
    "prisma-postgres": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-postgres/SKILL.md",
      "computedHash": "d669fbd0d8017d16c967f18b20e1c1345cd4a2a0076d762459bfef79f551f655"
    },
    "prisma-postgres-setup": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-postgres-setup/SKILL.md",
      "computedHash": "c89d3aa91285d8e4964fcaa5238c99a3d3c20b617e032e731cf632330a85a5a6"
    },
    "prisma-upgrade-v7": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-upgrade-v7/SKILL.md",
      "computedHash": "dcc6c71adca6b22f37c5bda5ac7fd63c3bb59495596a22e06a29c7c85371558f"
    }
  }
}
```

## src\app.ts

```ts
import express from "express";

import { mercadoLivreConfig } from "./configs/mercado-livre";
import { errorHandling } from "./middleware/error-handling";
import { routes } from "./routes";

const app = express();

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", mercadoLivreConfig.corsOrigin);

  response.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  response.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );

  if (request.method === "OPTIONS") {
    return response.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.get("/health", (_request, response) => {
  return response.json({ status: "ok" });
});

app.use(routes);

app.use(errorHandling);

export { app };
```

## src\configs\auth.ts

```ts
import { env } from "../../env";

export interface AuthConfigProps {
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: "1d",
  },
};
```

## src\configs\mercado-livre.ts

```ts
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
```

## src\controllers\blog-categories-controller.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";

import { blogCategoriesService } from "@/services/blog-categories-service";
import { createSlug } from "@/utils/createSlug";

const createBlogCategorySchema = z.object({
  name: z.string().trim().min(1, "O nome da categoria é obrigatório"),
  description: z.string().trim().optional(),
  image: z.string().trim().url("A imagem deve ser uma URL válida").optional(),
  active: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});

const updateBlogCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome da categoria é obrigatório")
    .optional(),
  description: z.string().trim().optional(),
  image: z.string().trim().url("A imagem deve ser uma URL válida").optional(),
  active: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});

const idSchema = z.object({
  id: z.string().uuid("ID da categoria do blog inválido"),
});

const slugSchema = z.object({
  slug: z.string().trim().min(1, "Slug inválido"),
});

export class BlogCategoriesController {
  async index(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        active: z
          .enum(["true", "false"])
          .transform((value) => value === "true")
          .optional(),
      })
      .parse(request.query);

    const categories = await blogCategoriesService.list({
      ...(query.search !== undefined
        ? {
            search: query.search,
          }
        : {}),
      ...(query.active !== undefined
        ? {
            active: query.active,
          }
        : {}),
    });

    return response.json({
      categories,
    });
  }

  async showById(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const category = await blogCategoriesService.findById(id);

    if (!category) {
      return response.status(404).json({
        message: "Categoria do blog não encontrada",
      });
    }

    return response.json({
      category,
    });
  }

  async showBySlug(request: Request, response: Response) {
    const { slug } = slugSchema.parse(request.params);

    const category = await blogCategoriesService.findBySlug(slug);

    if (!category) {
      return response.status(404).json({
        message: "Categoria do blog não encontrada",
      });
    }

    return response.json({
      category,
    });
  }

  async create(request: Request, response: Response) {
    const data = createBlogCategorySchema.parse(request.body);

    const slug = createSlug(data.name);

    const existingCategory = await blogCategoriesService.findBySlug(slug);

    if (existingCategory) {
      return response.status(409).json({
        message: "Já existe uma categoria do blog com esse nome.",
      });
    }

    const category = await blogCategoriesService.create({
      name: data.name,
      ...(data.description !== undefined
        ? {
            description: data.description,
          }
        : {}),
      ...(data.image !== undefined
        ? {
            image: data.image,
          }
        : {}),
      ...(data.active !== undefined
        ? {
            active: data.active,
          }
        : {}),
      ...(data.sortOrder !== undefined
        ? {
            sortOrder: data.sortOrder,
          }
        : {}),
    });

    return response.status(201).json({
      category,
    });
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const data = updateBlogCategorySchema.parse(request.body);

    const category = await blogCategoriesService.findById(id);

    if (!category) {
      return response.status(404).json({
        message: "Categoria do blog não encontrada",
      });
    }

    let slug: string | undefined;

    if (data.name !== undefined && data.name !== category.name) {
      slug = createSlug(data.name);

      const existingCategory = await blogCategoriesService.findBySlugExceptId(
        slug,
        category.id,
      );

      if (existingCategory) {
        return response.status(409).json({
          message: "Já existe uma categoria do blog com esse nome.",
        });
      }
    }

    const updatedCategory = await blogCategoriesService.update(category.id, {
      ...(data.name !== undefined
        ? {
            name: data.name,
          }
        : {}),
      ...(slug !== undefined
        ? {
            slug,
          }
        : {}),
      ...(data.description !== undefined
        ? {
            description: data.description,
          }
        : {}),
      ...(data.image !== undefined
        ? {
            image: data.image,
          }
        : {}),
      ...(data.active !== undefined
        ? {
            active: data.active,
          }
        : {}),
      ...(data.sortOrder !== undefined
        ? {
            sortOrder: data.sortOrder,
          }
        : {}),
    });

    return response.json({
      category: updatedCategory,
    });
  }

  async delete(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const category = await blogCategoriesService.findById(id);

    if (!category) {
      return response.status(404).json({
        message: "Categoria do blog não encontrada",
      });
    }

    await blogCategoriesService.delete(category.id);

    return response.status(204).send();
  }
}
```

## src\controllers\blog-controller.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";

import { BlogPostStatus } from "@/generated/prisma/client";
import { blogService } from "@/services/blog-service";
import { createSlug } from "@/utils/createSlug";

const blogPostProductSchema = z.object({
  productId: z.string().uuid("ID do produto inválido"),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});

const createBlogPostSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório"),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().min(1, "O conteúdo é obrigatório"),
  coverImage: z.string().trim().url().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),

  status: z.enum(BlogPostStatus).default(BlogPostStatus.DRAFT),

  publishedAt: z.coerce.date().optional(),
  scheduledAt: z.coerce.date().optional(),

  categoryId: z.string().uuid("ID da categoria do blog inválido").optional(),

  products: z.array(blogPostProductSchema).optional(),
});

const updateBlogPostSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório").optional(),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().min(1, "O conteúdo é obrigatório").optional(),
  coverImage: z.string().trim().url().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),

  status: z.enum(BlogPostStatus).optional(),

  publishedAt: z.coerce.date().optional(),
  scheduledAt: z.coerce.date().optional(),

  categoryId: z.string().uuid("ID da categoria do blog inválido").optional(),

  products: z.array(blogPostProductSchema).optional(),
});

const idSchema = z.object({
  id: z.string().uuid("ID do post inválido"),
});

const slugSchema = z.object({
  slug: z.string().trim().min(1, "Slug inválido"),
});

export class BlogController {
  async index(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        categoryId: z.string().uuid().optional(),
      })
      .parse(request.query);

    const posts = await blogService.list({
      ...(query.search !== undefined ? { search: query.search } : {}),

      ...(query.categoryId !== undefined
        ? { categoryId: query.categoryId }
        : {}),
    });

    return response.json({
      posts,
    });
  }

  async indexAdmin(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        categoryId: z.string().uuid().optional(),
        status: z.enum(BlogPostStatus).optional(),
      })
      .parse(request.query);

    const posts = await blogService.listAdmin({
      ...(query.search !== undefined ? { search: query.search } : {}),

      ...(query.categoryId !== undefined
        ? { categoryId: query.categoryId }
        : {}),

      ...(query.status !== undefined ? { status: query.status } : {}),
    });

    return response.json({
      posts,
    });
  }

  async create(request: Request, response: Response) {
    const data = createBlogPostSchema.parse(request.body);

    const slug = createSlug(data.title);

    const existingPost = await blogService.findBySlug(slug);

    if (existingPost) {
      return response.status(409).json({
        message: "Já existe um post com esse título.",
      });
    }

    const post = await blogService.create({
      title: data.title,
      content: data.content,
      authorId: request.user.id,

      ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),

      ...(data.coverImage !== undefined ? { coverImage: data.coverImage } : {}),

      ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),

      ...(data.seoDescription !== undefined
        ? { seoDescription: data.seoDescription }
        : {}),

      ...(data.status !== undefined ? { status: data.status } : {}),

      ...(data.publishedAt !== undefined
        ? { publishedAt: data.publishedAt }
        : {}),

      ...(data.scheduledAt !== undefined
        ? { scheduledAt: data.scheduledAt }
        : {}),

      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),

      ...(data.products !== undefined
        ? {
            products: data.products.map((product) => ({
              productId: product.productId,
              ...(product.sortOrder !== undefined
                ? { sortOrder: product.sortOrder }
                : {}),
            })),
          }
        : {}),
    });

    return response.status(201).json({
      post,
    });
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const data = updateBlogPostSchema.parse(request.body);

    const post = await blogService.findById(id);

    if (!post) {
      return response.status(404).json({
        message: "Post não encontrado",
      });
    }

    if (data.title && data.title !== post.title) {
      const slug = createSlug(data.title);

      const existingPost = await blogService.findBySlugExceptId(slug, post.id);

      if (existingPost) {
        return response.status(409).json({
          message: "Já existe um post com esse título.",
        });
      }
    }

    const updatedPost = await blogService.update(post.id, {
      ...(data.title !== undefined ? { title: data.title } : {}),

      ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),

      ...(data.content !== undefined ? { content: data.content } : {}),

      ...(data.coverImage !== undefined ? { coverImage: data.coverImage } : {}),

      ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),

      ...(data.seoDescription !== undefined
        ? { seoDescription: data.seoDescription }
        : {}),

      ...(data.status !== undefined ? { status: data.status } : {}),

      ...(data.publishedAt !== undefined
        ? { publishedAt: data.publishedAt }
        : {}),

      ...(data.scheduledAt !== undefined
        ? { scheduledAt: data.scheduledAt }
        : {}),

      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),

      ...(data.products !== undefined
        ? {
            products: data.products.map((product) => ({
              productId: product.productId,
              ...(product.sortOrder !== undefined
                ? { sortOrder: product.sortOrder }
                : {}),
            })),
          }
        : {}),
    });

    return response.json({
      post: updatedPost,
    });
  }

  async delete(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const post = await blogService.findById(id);

    if (!post) {
      return response.status(404).json({
        message: "Post não encontrado",
      });
    }

    await blogService.delete(post.id);

    return response.status(204).send();
  }

  async showById(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const post = await blogService.findById(id);

    if (!post) {
      return response.status(404).json({
        message: "Post não encontrado",
      });
    }

    return response.json({
      post,
    });
  }

  async show(request: Request, response: Response) {
    const { slug } = slugSchema.parse(request.params);

    const post = await blogService.findBySlug(slug);

    if (!post) {
      return response.status(404).json({
        message: "Post não encontrado",
      });
    }

    return response.json({
      post,
    });
  }
}
```

## src\controllers\categories-controllers.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { categoryService } from "../services/categories-service";
import { createSlug } from "../utils/createSlug";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome da categoria deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  image: z.string().url("Imagem deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome da categoria deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  image: z.string().url("Imagem deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const idSchema = z.object({
  id: z.string().uuid(),
});

export class CategoryController {
  async create(request: Request, response: Response) {
    const data = createCategorySchema.parse(request.body);

    const slug = createSlug(data.name);

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return response
        .status(409)
        .json({ message: "Já existe uma categoria com esse nome." });
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description ?? null,
        image: data.image ?? null,
      },
    });

    return response.status(201).json({ category });
  }

  async list(req: Request, res: Response) {
    const categories = await categoryService.list();
    return res.json(categories);
  }

  async get(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    const category = await categoryService.get(id);

    if (!category) {
      return res.status(404).json({
        error: "Categoria não encontrada",
      });
    }

    return res.json(category);
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const data = updateCategorySchema.parse(request.body);

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return response.status(404).json({
        message: "Categoria não encontrada",
      });
    }

    let slug = category.slug;

    if (data.name && data.name !== category.name) {
      slug = createSlug(data.name);

      const existingCategory = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: category.id },
        },
      });

      if (existingCategory) {
        return response
          .status(409)
          .json({ message: "Já existe uma categoria com esse nome." });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: category.id,
      },
      data: {
        ...(data.name !== undefined ? { name: data.name, slug } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
        ...(data.active !== undefined ? { active: data.active } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      },
    });

    return response.json({
      category: updatedCategory,
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    await categoryService.delete(id);

    return res.status(204).send();
  }
}
```

## src\controllers\marketplace-controller.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { marketplaceService } from "../services/marketplace-service";
import { createSlug } from "../utils/createSlug";

export const marketplaceSchema = z.object({
  name: z
    .string()
    .min(2, "O nome do marketplace deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  websiteUrl: z.string().url("Website deve ser uma URL válida").optional(),
  logoUrl: z.string().url("Logo deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const createMarketplaceSchema = z.object({
  name: z
    .string()
    .min(2, "O nome do marketplace deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  websiteUrl: z.string().url("Website deve ser uma URL válida").optional(),
  logoUrl: z.string().url("Logo deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const updateMarketplaceSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const idSchema = z.object({
  id: z.string().uuid(),
});

export class MarketplaceController {
  async create(request: Request, response: Response) {
    const data = createMarketplaceSchema.parse(request.body);

    const slug = createSlug(data.name);

    const existingMarketplace = await prisma.marketplace.findUnique({
      where: {
        slug,
      },
    });

    if (existingMarketplace) {
      return response.status(409).json({
        message: "Já existe um marketplace com esse nome.",
      });
    }

    const marketplace = await prisma.marketplace.create({
      data: {
        name: data.name,
        slug,
        description: data.description ?? null,
        websiteUrl: data.websiteUrl ?? null,
        logoUrl: data.logoUrl ?? null,
        active: data.active,
        sortOrder: data.sortOrder,
      },
    });

    return response.status(201).json({
      marketplace,
    });
  }

  async list(req: Request, res: Response) {
    const marketplaces = await marketplaceService.list();

    return res.json(marketplaces);
  }

  async get(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    const marketplace = await marketplaceService.get(id);

    if (!marketplace) {
      return res.status(404).json({
        error: "Marketplace não encontrado",
      });
    }

    return res.json(marketplace);
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const data = updateMarketplaceSchema.parse(request.body);

    const marketplace = await prisma.marketplace.findUnique({
      where: {
        id,
      },
    });

    if (!marketplace) {
      return response.status(404).json({
        message: "Marketplace não encontrado",
      });
    }

    let slug = marketplace.slug;

    if (data.name && data.name !== marketplace.name) {
      slug = createSlug(data.name);

      const existingMarketplace = await prisma.marketplace.findFirst({
        where: {
          slug,
          id: {
            not: marketplace.id,
          },
        },
      });

      if (existingMarketplace) {
        return response.status(409).json({
          message: "Já existe um marketplace com esse nome.",
        });
      }
    }

    const updatedMarketplace = await prisma.marketplace.update({
      where: {
        id: marketplace.id,
      },
      data: {
        ...(data.name !== undefined
          ? {
              name: data.name,
              slug,
            }
          : {}),
        ...(data.description !== undefined
          ? {
              description: data.description,
            }
          : {}),
        ...(data.websiteUrl !== undefined
          ? {
              websiteUrl: data.websiteUrl,
            }
          : {}),
        ...(data.logoUrl !== undefined
          ? {
              logoUrl: data.logoUrl,
            }
          : {}),
        ...(data.active !== undefined
          ? {
              active: data.active,
            }
          : {}),
        ...(data.sortOrder !== undefined
          ? {
              sortOrder: data.sortOrder,
            }
          : {}),
      },
    });

    return response.json({
      marketplace: updatedMarketplace,
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    await marketplaceService.delete(id);

    return res.status(204).send();
  }
}
```

## src\controllers\mercado-livre-controller.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";

import { mercadoLivreConfig } from "@/configs/mercado-livre";

import {
  analyzeMercadoLivreExternalLink,
  connectMercadoLivre,
  getMercadoLivreAuthorizationUrl,
  getMercadoLivreProducts,
  importMercadoLivreProduct,
  syncMercadoLivreProducts,
  updateMercadoLivreProductOffer,
} from "@/services/mercado-livre-service";

const imageSchema = z.object({
  imageUrl: z.string().url(),
  sortOrder: z.number().int().min(0).optional(),
});

const importProductSchema = z.object({
  affiliateUrl: z.string().url(),
  externalLink: z.string().url(),

  catalogProductId: z.string().regex(/^MLB\d+$/i),
  itemId: z.string().regex(/^MLB\d+$/i),
  sellerId: z.string().regex(/^\d+$/),

  subcategoryId: z.string().uuid(),

  title: z.string().min(1),
  description: z.string().optional(),
  shortDescription: z.string().optional(),

  imageUrl: z.string().url().optional(),
  images: z.array(imageSchema).optional(),

  price: z.number().nonnegative().optional(),
  originalPrice: z.number().nonnegative().optional(),
  currency: z.string().min(1).max(10).optional(),

  rating: z.number().min(0).max(5).optional(),
  reviewsCount: z.number().int().min(0).optional(),

  featured: z.boolean().optional(),
  destaque: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
  available: z.boolean().optional(),
  active: z.boolean().optional(),

  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const updateProductOfferSchema = z.object({
  externalLink: z.string().url(),

  catalogProductId: z.string().regex(/^MLB\d+$/i),
  itemId: z.string().regex(/^MLB\d+$/i),
  sellerId: z.string().regex(/^\d+$/),
});

export class MercadoLivreController {
  authorize(_request: Request, response: Response) {
    return response.json({
      authorizationUrl: getMercadoLivreAuthorizationUrl(),
    });
  }

  async callback(request: Request, response: Response) {
    const query = z
      .object({
        code: z.string(),
        state: z.string(),
      })
      .parse(request.query);

    await connectMercadoLivre(query.code, query.state);

    return response.redirect(
      `${mercadoLivreConfig.webUrl}/?mercadoLivre=connected`,
    );
  }

  async products(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().optional(),
      })
      .parse(request.query);

    return response.json({
      products: await getMercadoLivreProducts(query.search),
    });
  }

  async analyzeProduct(request: Request, response: Response) {
    const body = z
      .object({
        externalLink: z.string().url(),
      })
      .parse(request.body);

    const result = await analyzeMercadoLivreExternalLink(body.externalLink);

    return response.json(result);
  }

  async importProduct(request: Request, response: Response) {
    const body = importProductSchema.parse(request.body);

    const input = {
      affiliateUrl: body.affiliateUrl,
      externalLink: body.externalLink,
      catalogProductId: body.catalogProductId,
      itemId: body.itemId,
      sellerId: body.sellerId,
      subcategoryId: body.subcategoryId,
      title: body.title,

      ...(body.description !== undefined
        ? { description: body.description }
        : {}),

      ...(body.shortDescription !== undefined
        ? { shortDescription: body.shortDescription }
        : {}),

      ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl } : {}),

      ...(body.images !== undefined
        ? {
            images: body.images.map((image) =>
              image.sortOrder !== undefined
                ? {
                    imageUrl: image.imageUrl,
                    sortOrder: image.sortOrder,
                  }
                : {
                    imageUrl: image.imageUrl,
                  },
            ),
          }
        : {}),

      ...(body.price !== undefined ? { price: body.price } : {}),

      ...(body.originalPrice !== undefined
        ? { originalPrice: body.originalPrice }
        : {}),

      ...(body.currency !== undefined ? { currency: body.currency } : {}),

      ...(body.rating !== undefined ? { rating: body.rating } : {}),

      ...(body.reviewsCount !== undefined
        ? { reviewsCount: body.reviewsCount }
        : {}),

      ...(body.featured !== undefined ? { featured: body.featured } : {}),

      ...(body.destaque !== undefined ? { destaque: body.destaque } : {}),

      ...(body.bestSeller !== undefined ? { bestSeller: body.bestSeller } : {}),

      ...(body.available !== undefined ? { available: body.available } : {}),

      ...(body.active !== undefined ? { active: body.active } : {}),

      ...(body.seoTitle !== undefined ? { seoTitle: body.seoTitle } : {}),

      ...(body.seoDescription !== undefined
        ? { seoDescription: body.seoDescription }
        : {}),
    };

    const product = await importMercadoLivreProduct(input);

    return response.status(201).json({
      message: "Produto do Mercado Livre importado com sucesso",
      product,
    });
  }

  async updateProductOffer(request: Request, response: Response) {
    const productId = z.string().uuid().parse(request.params.productId);

    const body = updateProductOfferSchema.parse(request.body);

    const product = await updateMercadoLivreProductOffer(productId, body);

    return response.status(200).json({
      message: "Oferta do Mercado Livre atualizada com sucesso",
      product,
    });
  }

  async sync(_request: Request, response: Response) {
    const result = await syncMercadoLivreProducts();

    return response.json({
      message: "Produtos do Mercado Livre sincronizados com sucesso",
      products: result.products,
    });
  }
}
```

## src\controllers\products-controller.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";
import { syncMercadoLivreProducts } from "@/services/mercado-livre-service";
import { productsService } from "@/services/products-service";
import { createSlug } from "@/utils/createSlug";

const productImageSchema = z.object({
  imageUrl: z.string().trim().url(),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});
const createProductSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),
  imageUrl: z.string().trim().url(),
  images: z.array(productImageSchema).optional(),
  price: z.coerce.number().nonnegative(),
  originalPrice: z.coerce.number().nonnegative().optional(),
  currency: z.string().trim().default("BRL"),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewsCount: z.coerce.number().int().nonnegative().default(0),
  affiliateUrl: z.string().trim().url(),
  subcategoryId: z.string().uuid("ID da subcategoria inválido"),
  marketplaceId: z.string().uuid("ID do marketplace inválido"),
  featured: z.coerce.boolean().default(false),
  destaque: z.coerce.boolean().default(false),
  bestSeller: z.coerce.boolean().default(false),
  available: z.coerce.boolean().default(true),
  active: z.coerce.boolean().default(true),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});
const updateProductSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),
  imageUrl: z.string().trim().url().optional(),
  images: z.array(productImageSchema).optional(),
  price: z.coerce.number().nonnegative().optional(),
  originalPrice: z.coerce.number().nonnegative().optional(),
  currency: z.string().trim().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewsCount: z.coerce.number().int().nonnegative().optional(),
  affiliateUrl: z.string().trim().url().optional(),
  subcategoryId: z.string().uuid().optional(),
  marketplaceId: z.string().uuid().optional(),
  featured: z.coerce.boolean().optional(),
  destaque: z.coerce.boolean().optional(),
  bestSeller: z.coerce.boolean().optional(),
  available: z.coerce.boolean().optional(),
  active: z.coerce.boolean().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});
const updateProductStatusSchema = z
  .object({
    active: z.coerce.boolean().optional(),
    available: z.coerce.boolean().optional(),
    featured: z.coerce.boolean().optional(),
    destaque: z.coerce.boolean().optional(),
    bestSeller: z.coerce.boolean().optional(),
  })
  .refine(
    (data) =>
      data.active !== undefined ||
      data.available !== undefined ||
      data.featured !== undefined ||
      data.destaque !== undefined ||
      data.bestSeller !== undefined,
    { message: "Informe pelo menos um status para atualizar." },
  );
const idSchema = z.object({ id: z.string().uuid() });
const slugSchema = z.object({ slug: z.string().trim().min(1) });
const productSortSchema = z.enum([
  "recent",
  "price_asc",
  "price_desc",
  "rating",
]);
type CreateProductData = z.infer<typeof createProductSchema>;
type UpdateProductData = z.infer<typeof updateProductSchema>;
type UpdateProductStatusData = z.infer<typeof updateProductStatusSchema>;
export class ProductsController {
  async index(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        category: z.string().trim().optional(),
        subcategoryId: z.string().uuid().optional(),
        marketplaceId: z.string().uuid().optional(),
        featured: z.coerce.boolean().optional(),
        destaque: z.coerce.boolean().optional(),
        bestSeller: z.coerce.boolean().optional(),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(24),
        sort: productSortSchema.default("recent"),
      })
      .parse(request.query);
    const result = await productsService.list(query);
    return response.json(result);
  }
  async indexAdmin(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        subcategoryId: z.string().uuid().optional(),
        marketplaceId: z.string().uuid().optional(),
        featured: z.coerce.boolean().optional(),
        destaque: z.coerce.boolean().optional(),
        bestSeller: z.coerce.boolean().optional(),
        active: z.coerce.boolean().optional(),
        available: z.coerce.boolean().optional(),
      })
      .parse(request.query);
    const products = await productsService.listAdmin(query);
    return response.json({ products });
  }
  async create(request: Request, response: Response) {
    const data: CreateProductData = createProductSchema.parse(request.body);
    const slug = createSlug(data.title);
    const existingProduct = await productsService.findBySlug(slug);
    if (existingProduct) {
      return response
        .status(409)
        .json({ message: "Já existe um produto com esse título." });
    }
    const product = await productsService.create(data);
    return response.status(201).json({ product });
  }
  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const data: UpdateProductData = updateProductSchema.parse(request.body);
    const product = await productsService.findById(id);
    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }
    if (data.title && data.title !== product.title) {
      const slug = createSlug(data.title);
      const existingProduct = await productsService.findBySlugExceptId(
        slug,
        product.id,
      );
      if (existingProduct) {
        return response
          .status(409)
          .json({ message: "Já existe um produto com esse título." });
      }
    }
    const updatedProduct = await productsService.update(product.id, data);
    return response.json({ product: updatedProduct });
  }
  async updateStatus(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const data: UpdateProductStatusData = updateProductStatusSchema.parse(
      request.body,
    );
    const product = await productsService.findById(id);
    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }
    const updatedProduct = await productsService.updateStatus(product.id, data);
    return response.json({ product: updatedProduct });
  }
  async sync(request: Request, response: Response) {
    const expectedSecret = process.env.PRODUCT_SYNC_SECRET;
    const receivedSecret = request.header("x-sync-token");
    if (!expectedSecret || receivedSecret !== expectedSecret) {
      return response.status(401).json({ message: "Não autorizado" });
    }
    const result = await syncMercadoLivreProducts();
    return response.json({
      products: result.products,
      synced: result.products.length,
    });
  }
  async showById(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const product = await productsService.findById(id);
    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }
    return response.json({ product });
  }
  async show(request: Request, response: Response) {
    const { slug } = slugSchema.parse(request.params);
    const product = await productsService.findBySlug(slug);
    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }
    return response.json({ product });
  }
}
```

## src\controllers\search-controller.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";

import { searchService } from "@/services/search-service";

const searchSchema = z.object({
  q: z
    .string()
    .trim()
    .min(1, "Informe um termo para pesquisa.")
    .max(100, "O termo de pesquisa é muito longo."),
});

export class SearchController {
  async search(request: Request, response: Response) {
    const { q } = searchSchema.parse(request.query);

    const results = await searchService.search(q);

    return response.json({
      query: q,
      ...results,
    });
  }
}
```

## src\controllers\sessions-controllers.ts

```ts
import { compare } from "bcrypt";
import type { Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { authConfig } from "@/configs/auth";
import { prisma } from "@/database/prisma";
import { AppError } from "../utils/AppError";

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email({ message: "Email invalid" }),
      password: z.string(),
    });
    const { email, password } = bodySchema.parse(request.body);
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new AppError("Email or Password invalid!", 401);
    }
    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new AppError("Email or Password invalid!", 401);
    }
    const { secret } = authConfig.jwt;

    if (!secret) {
      throw new AppError("JWT_SECRET não configurado", 500);
    }

    const options: SignOptions = {
      subject: String(user.id),
      expiresIn: "1d",
    };

    const token = jwt.sign({ role: user.role }, secret, options);
    const { password: _, ...userWithoutPassword } = user;

    return response.json({ token, user: userWithoutPassword });
  }
}

export { SessionsController };
```

## src\controllers\subcategories-controller.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { subcategoriesService } from "../services/subcategories-services";
import { createSlug } from "../utils/createSlug";

export const subcategorySchema = z.object({
  categoryId: z.string().uuid(),
  name: z
    .string()
    .min(2, "O nome da subcategoria deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  image: z.string().url("Imagem deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const createSubcategorySchema = z.object({
  categoryId: z.string().uuid(),
  name: z
    .string()
    .min(2, "O nome da subcategoria deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  image: z.string().url("Imagem deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const updateSubcategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const idSchema = z.object({
  id: z.string().uuid(),
});

export class SubcategoriesController {
  async create(request: Request, response: Response) {
    const data = createSubcategorySchema.parse(request.body);

    const slug = createSlug(data.name);

    const existingSubcategory = await prisma.subcategory.findUnique({
      where: {
        categoryId_slug: {
          categoryId: data.categoryId,
          slug,
        },
      },
    });

    if (existingSubcategory) {
      return response.status(409).json({
        message: "Já existe uma subcategoria com esse nome.",
      });
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        slug,
        description: data.description ?? null,
        image: data.image ?? null,
        active: data.active,
        sortOrder: data.sortOrder,
      },
    });

    return response.status(201).json({
      subcategory,
    });
  }

  async list(req: Request, res: Response) {
    const subcategories = await subcategoriesService.list();

    return res.json(subcategories);
  }

  async get(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    const subcategory = await subcategoriesService.get(id);

    if (!subcategory) {
      return res.status(404).json({
        error: "Subcategoria não encontrada",
      });
    }

    return res.json(subcategory);
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const data = updateSubcategorySchema.parse(request.body);

    const subcategory = await prisma.subcategory.findUnique({
      where: {
        id,
      },
    });

    if (!subcategory) {
      return response.status(404).json({
        message: "Subcategoria não encontrada",
      });
    }

    let slug = subcategory.slug;

    if (data.name && data.name !== subcategory.name) {
      slug = createSlug(data.name);

      const existingSubcategory = await prisma.subcategory.findFirst({
        where: {
          slug,
          id: {
            not: subcategory.id,
          },
        },
      });

      if (existingSubcategory) {
        return response.status(409).json({
          message: "Já existe uma subcategoria com esse nome.",
        });
      }
    }

    const updatedSubcategory = await prisma.subcategory.update({
      where: {
        id: subcategory.id,
      },
      data: {
        ...(data.name !== undefined
          ? {
              name: data.name,
              slug,
            }
          : {}),
        ...(data.description !== undefined
          ? {
              description: data.description,
            }
          : {}),
        ...(data.image !== undefined
          ? {
              image: data.image,
            }
          : {}),
        ...(data.active !== undefined
          ? {
              active: data.active,
            }
          : {}),
        ...(data.sortOrder !== undefined
          ? {
              sortOrder: data.sortOrder,
            }
          : {}),
      },
    });

    return response.json({
      subcategory: updatedSubcategory,
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    await subcategoriesService.delete(id);

    return res.status(204).send();
  }
}
```

## src\controllers\users-controllers.ts

```ts
import { hash } from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import z from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class UserController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(3),
        email: z.email(),
        password: z.string().min(6),
      });

      const { name, email, password } = bodySchema.parse(request.body);

      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithSameEmail) {
        throw new AppError("Email already exists", 400);
      }

      const hashedPassword = await hash(password, 8);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      const { password: _, ...userWithoutPassword } = user;
      return response.json(userWithoutPassword);
    } catch (error) {
      console.log(error);
      next();
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    const users = await prisma.user.findMany();
    return response.json(users);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid({ message: "ID do usuário inválido." }),
      });

      const { id } = paramsSchema.parse(request.params);

      const bodySchema = z.object({
        name: z
          .string()
          .trim()
          .min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
          .optional(),
        email: z.string().email().optional(),
        password: z.string().min(6).optional(),
        role: z.enum(["ADMIN", "TECNICO", "CLIENTE"]).optional(),
      });

      const data = bodySchema.parse(request.body);
      const roleMap = {
        ADMIN: "admin",
        TECNICO: "sale",
        CLIENTE: "customer",
      } as const;

      const cleanData: {
        name?: string;
        email?: string;
        password?: string;
        role?: "customer" | "admin" | "sale";
      } = {};

      if (data.name !== undefined) cleanData.name = data.name;
      if (data.email !== undefined) cleanData.email = data.email;
      if (data.password !== undefined)
        cleanData.password = await hash(data.password, 8);
      if (data.role !== undefined) cleanData.role = roleMap[data.role];

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      if (Object.keys(cleanData).length === 0) {
        throw new AppError("Nenhum campo informado para atualização", 400);
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: cleanData,
      });

      const { password, ...userWithoutPassword } = updatedUser;

      return response.status(200).json(userWithoutPassword);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export { UserController };
```

## src\database\prisma.ts

```ts
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "../../env";
import { PrismaClient } from "../generated/prisma/client";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "production" ? [] : ["query"],
});
```

## src\middleware\ensure-admin.ts

```ts
import type { NextFunction, Request, Response } from "express";

import { AppError } from "@/utils/AppError";

export function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (request.user.role !== "admin") {
    throw new AppError("Acesso permitido somente para administradores", 403);
  }

  return next();
}
```

## src\middleware\ensure-authenticated.ts

```ts
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";

interface TokenPayload {
  sub: string;
  role: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token não informado", 401);
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    throw new AppError("Token inválido", 401);
  }

  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret) as TokenPayload;

    request.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    return next();
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }
}
```

## src\middleware\error-handling.ts

```ts
/*src/middleware/error-handling*/
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

export function errorHandling(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }
  if (error instanceof ZodError) {
    return response
      .status(400)
      .json({ message: "Validation error", issues: error });
  }
  return response.status(500).json({ message: error.message });
}
```

## src\routes\blog-categories-routes.ts

```ts
import { Router } from "express";

import { BlogCategoriesController } from "@/controllers/blog-categories-controller";
import { ensureAdmin } from "@/middleware/ensure-admin";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const blogCategoriesRoutes = Router();

const blogCategoriesController = new BlogCategoriesController();

// Públicas — leitura
blogCategoriesRoutes.get("/", blogCategoriesController.index);

blogCategoriesRoutes.get("/slug/:slug", blogCategoriesController.showBySlug);

// Administrativas — leitura por ID
blogCategoriesRoutes.get(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  blogCategoriesController.showById,
);

// Administrativas — criação
blogCategoriesRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  blogCategoriesController.create,
);

// Administrativas — atualização
blogCategoriesRoutes.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  blogCategoriesController.update,
);

// Administrativas — exclusão
blogCategoriesRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  blogCategoriesController.delete,
);

export { blogCategoriesRoutes };
```

## src\routes\blog-routes.ts

```ts
import { Router } from "express";

import { BlogController } from "@/controllers/blog-controller";

import { ensureAdmin } from "@/middleware/ensure-admin";

import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const blogRoutes = Router();

const blogController = new BlogController();

// Públicas

blogRoutes.get("/", blogController.index);

// Administrativas
// Devem ficar antes de /:slug para não serem interpretadas como slug.

blogRoutes.get(
  "/admin",
  ensureAuthenticated,
  ensureAdmin,
  blogController.indexAdmin,
);

blogRoutes.get(
  "/id/:id",
  ensureAuthenticated,
  ensureAdmin,
  blogController.showById,
);

blogRoutes.post("/", ensureAuthenticated, ensureAdmin, blogController.create);

blogRoutes.put("/:id", ensureAuthenticated, ensureAdmin, blogController.update);

blogRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  blogController.delete,
);

// Pública por slug
// Deve ficar depois das rotas administrativas específicas.

blogRoutes.get("/:slug", blogController.show);

export { blogRoutes };
```

## src\routes\categories-routes.ts

```ts
// src/routes/category-routes.ts
import { Router } from "express";

import { CategoryController } from "../controllers/categories-controllers";
import { ensureAdmin } from "../middleware/ensure-admin";
import { ensureAuthenticated } from "../middleware/ensure-authenticated";

const categoriesRouter = Router();

const categoryController = new CategoryController();

// Públicas/autenticadas para leitura
categoriesRouter.get("/", categoryController.list);
categoriesRouter.get("/:id", categoryController.get);

// Administrativas
categoriesRouter.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  categoryController.create,
);

categoriesRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  categoryController.update,
);

categoriesRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  categoryController.delete,
);

export { categoriesRouter as categoriesRoutes };
```

## src\routes\index.ts

```ts
/* src/routes/index.ts */

import { Router } from "express";
import { blogCategoriesRoutes } from "@/routes/blog-categories-routes";
import { searchRouter } from "@/routes/search-routes";
import { blogRoutes } from "./blog-routes";
import { categoriesRoutes } from "./categories-routes";
import { marketplaceRoutes } from "./marketplace-routes";
import { mercadoLivreRoutes } from "./mercado-livre-routes";
import { productRoutes } from "./product-routes";
import { sessionsRoutes } from "./sessions-routes";
import { subcategoriesRoutes } from "./subcategories-routes";
import { userRoutes } from "./user-routes";

const routes = Router();

routes.use("/users", userRoutes);

routes.use("/session", sessionsRoutes);

routes.use("/mercado-livre", mercadoLivreRoutes);

routes.use("/products", productRoutes);

routes.use("/categories", categoriesRoutes);

routes.use("/subcategories", subcategoriesRoutes);

routes.use("/marketplaces", marketplaceRoutes);

routes.use("/search", searchRouter);

routes.use("/blog/categories", blogCategoriesRoutes);

routes.use("/blog", blogRoutes);

export { routes };
```

## src\routes\marketplace-routes.ts

```ts
import { Router } from "express";

import { MarketplaceController } from "../controllers/marketplace-controller";
import { ensureAdmin } from "../middleware/ensure-admin";
import { ensureAuthenticated } from "../middleware/ensure-authenticated";

const marketplaceRouter = Router();

const marketplaceController = new MarketplaceController();

// Públicas para leitura
marketplaceRouter.get("/", marketplaceController.list);
marketplaceRouter.get("/:id", marketplaceController.get);

// Administrativas
marketplaceRouter.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  marketplaceController.create,
);

marketplaceRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  marketplaceController.update,
);

marketplaceRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  marketplaceController.delete,
);

export { marketplaceRouter as marketplaceRoutes };
```

## src\routes\mercado-livre-routes.ts

```ts
import { Router } from "express";

import { MercadoLivreController } from "@/controllers/mercado-livre-controller";
import { ensureAdmin } from "@/middleware/ensure-admin";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";
import { analyzeMercadoLivrePublicPage } from "@/services/mercado-livre/mercado-livre.service";
import { findCatalogOfferByItem } from "@/services/mercado-livre-service";

const mercadoLivreRoutes = Router();

const controller = new MercadoLivreController();

mercadoLivreRoutes.get("/authorize", controller.authorize.bind(controller));

mercadoLivreRoutes.get("/callback", controller.callback.bind(controller));

mercadoLivreRoutes.get("/products", controller.products.bind(controller));

mercadoLivreRoutes.get(
  "/products/check-offer",
  ensureAuthenticated,
  ensureAdmin,
  async (request, response) => {
    try {
      const { catalogProductId, sellerId, itemId } = request.query;

      if (
        typeof catalogProductId !== "string" ||
        typeof sellerId !== "string" ||
        typeof itemId !== "string"
      ) {
        return response.status(400).json({
          message:
            "Informe catalogProductId, sellerId e itemId como parâmetros da consulta.",
        });
      }

      const result = await findCatalogOfferByItem(
        catalogProductId,
        sellerId,
        itemId,
      );

      return response.status(200).json({
        catalogProductId,
        sellerId,
        itemId,
        ...result,
      });
    } catch (error) {
      console.error("Erro ao verificar oferta do Mercado Livre:", error);

      return response.status(500).json({
        message: "Erro ao verificar oferta do Mercado Livre.",
      });
    }
  },
);

mercadoLivreRoutes.post(
  "/products/analyze",
  ensureAuthenticated,
  ensureAdmin,
  controller.analyzeProduct.bind(controller),
);

mercadoLivreRoutes.post(
  "/products/import",
  ensureAuthenticated,
  ensureAdmin,
  controller.importProduct.bind(controller),
);

/*
 * Atualiza a oferta vinculada a um produto já existente.
 *
 * Importante:
 * - não cria Product;
 * - não cria MarketplaceProduct;
 * - mantém os mesmos IDs;
 * - atualiza apenas a referência/oferta do Mercado Livre.
 */
mercadoLivreRoutes.put(
  "/products/:productId/offer",
  ensureAuthenticated,
  ensureAdmin,
  controller.updateProductOffer.bind(controller),
);

mercadoLivreRoutes.post(
  "/products/analyze-page",
  ensureAuthenticated,
  ensureAdmin,
  async (request, response) => {
    try {
      const { url } = request.body;

      if (typeof url !== "string" || !url.trim()) {
        return response.status(400).json({
          message: "Informe a URL do produto do Mercado Livre.",
        });
      }

      const result = await analyzeMercadoLivrePublicPage(url);

      return response.status(200).json(result);
    } catch (error) {
      console.error("Erro ao analisar página pública do Mercado Livre:", error);

      return response.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao analisar página pública do Mercado Livre.",
      });
    }
  },
);

mercadoLivreRoutes.post(
  "/sync",
  ensureAuthenticated,
  ensureAdmin,
  controller.sync.bind(controller),
);

export { mercadoLivreRoutes };
```

## src\routes\product-routes.ts

```ts
import { Router } from "express";

import { ProductsController } from "@/controllers/products-controller";

import { ensureAdmin } from "@/middleware/ensure-admin";

import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const productRoutes = Router();

const productsController = new ProductsController();

// Públicas

productRoutes.get("/", productsController.index);

productRoutes.get(
  "/admin",
  ensureAuthenticated,
  ensureAdmin,
  productsController.indexAdmin,
);

productRoutes.get(
  "/id/:id",
  ensureAuthenticated,
  ensureAdmin,
  productsController.showById,
);

productRoutes.get("/:slug", productsController.show);

// Administrativas

productRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  productsController.create,
);

productRoutes.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  productsController.update,
);

productRoutes.patch(
  "/:id/status",
  ensureAuthenticated,
  ensureAdmin,
  productsController.updateStatus,
);

productRoutes.post(
  "/sync",
  ensureAuthenticated,
  ensureAdmin,
  productsController.sync,
);

export { productRoutes };
```

## src\routes\search-routes.ts

```ts
import { Router } from "express";

import { SearchController } from "@/controllers/search-controller";

const searchRouter = Router();

const searchController = new SearchController();

searchRouter.get("/", searchController.search);

export { searchRouter };
```

## src\routes\sessions-routes.ts

```ts
import { Router } from "express";
import { SessionsController } from "@/controllers/sessions-controllers";

const sessionsRoutes = Router();
const sessionsController = new SessionsController();

sessionsRoutes.post("/", sessionsController.create);

export { sessionsRoutes };
```

## src\routes\subcategories-routes.ts

```ts
import { Router } from "express";

import { SubcategoriesController } from "../controllers/subcategories-controller";
import { ensureAdmin } from "../middleware/ensure-admin";
import { ensureAuthenticated } from "../middleware/ensure-authenticated";

const subcategoriesRouter = Router();

const subcategoriesController = new SubcategoriesController();

// Públicas para leitura
subcategoriesRouter.get("/", subcategoriesController.list);
subcategoriesRouter.get("/:id", subcategoriesController.get);

// Administrativas
subcategoriesRouter.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  subcategoriesController.create,
);

subcategoriesRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  subcategoriesController.update,
);

subcategoriesRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  subcategoriesController.delete,
);

export { subcategoriesRouter as subcategoriesRoutes };
```

## src\routes\user-routes.ts

```ts
import { Router } from "express";

import { UserController } from "@/controllers/users-controllers";
import { ensureAdmin } from "@/middleware/ensure-admin";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const userRoutes = Router();

const userController = new UserController();

// Cadastro público
userRoutes.post("/", userController.create);

// Somente administrador
userRoutes.get("/", ensureAuthenticated, ensureAdmin, userController.index);

userRoutes.patch(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  userController.update,
);

userRoutes.put("/:id", ensureAuthenticated, ensureAdmin, userController.update);

export { userRoutes };
```

## src\server.ts

```ts
import { app } from "@/app";

const PORT = Number(process.env.PORT ?? 3333);

app.listen(PORT, () => {
  console.log(`WorldMix360 API rodando na porta: ${PORT}`);
});
```

## src\services\blog-categories-service.ts

```ts
import { prisma } from "@/database/prisma";

interface ListBlogCategoriesParams {
  search?: string;
  active?: boolean;
}

interface CreateBlogCategoryData {
  name: string;
  description?: string;
  image?: string;
  active?: boolean;
  sortOrder?: number;
}

interface UpdateBlogCategoryData {
  name?: string;
  description?: string;
  image?: string;
  active?: boolean;
  sortOrder?: number;
  slug?: string;
}

function normalizeSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function serializeBlogCategory(category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date | null;
  _count?: {
    posts: number;
  };
}) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    active: category.active,
    sortOrder: category.sortOrder,
    postsCount: category._count?.posts ?? 0,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

const blogCategoryInclude = {
  _count: {
    select: {
      posts: true,
    },
  },
};

export const blogCategoriesService = {
  async list(params: ListBlogCategoriesParams = {}) {
    const where = {
      ...(params.search
        ? {
            OR: [
              {
                name: {
                  contains: params.search,
                  mode: "insensitive" as const,
                },
              },
              {
                description: {
                  contains: params.search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
      ...(params.active !== undefined
        ? {
            active: params.active,
          }
        : {}),
    };

    const categories = await prisma.blogCategory.findMany({
      where,
      include: blogCategoryInclude,
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    return categories.map(serializeBlogCategory);
  },

  async findById(id: string) {
    const category = await prisma.blogCategory.findUnique({
      where: {
        id,
      },
      include: blogCategoryInclude,
    });

    if (!category) {
      return null;
    }

    return serializeBlogCategory(category);
  },

  async findBySlug(slug: string) {
    const category = await prisma.blogCategory.findUnique({
      where: {
        slug,
      },
      include: blogCategoryInclude,
    });

    if (!category) {
      return null;
    }

    return serializeBlogCategory(category);
  },

  async findBySlugExceptId(slug: string, id: string) {
    const category = await prisma.blogCategory.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
      include: blogCategoryInclude,
    });

    if (!category) {
      return null;
    }

    return serializeBlogCategory(category);
  },

  async create(data: CreateBlogCategoryData) {
    const slug = normalizeSlug(data.name);

    const category = await prisma.blogCategory.create({
      data: {
        name: data.name,
        slug,
        ...(data.description !== undefined
          ? {
              description: data.description,
            }
          : {}),
        ...(data.image !== undefined
          ? {
              image: data.image,
            }
          : {}),
        ...(data.active !== undefined
          ? {
              active: data.active,
            }
          : {}),
        ...(data.sortOrder !== undefined
          ? {
              sortOrder: data.sortOrder,
            }
          : {}),
      },
      include: blogCategoryInclude,
    });

    return serializeBlogCategory(category);
  },

  async update(id: string, data: UpdateBlogCategoryData) {
    const category = await prisma.blogCategory.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined
          ? {
              name: data.name,
            }
          : {}),
        ...(data.slug !== undefined
          ? {
              slug: data.slug,
            }
          : {}),
        ...(data.description !== undefined
          ? {
              description: data.description,
            }
          : {}),
        ...(data.image !== undefined
          ? {
              image: data.image,
            }
          : {}),
        ...(data.active !== undefined
          ? {
              active: data.active,
            }
          : {}),
        ...(data.sortOrder !== undefined
          ? {
              sortOrder: data.sortOrder,
            }
          : {}),
      },
      include: blogCategoryInclude,
    });

    return serializeBlogCategory(category);
  },

  async delete(id: string) {
    await prisma.blogCategory.delete({
      where: {
        id,
      },
    });
  },
};
```

## src\services\blog-service.ts

```ts
import { prisma } from "@/database/prisma";
import { BlogPostStatus } from "@/generated/prisma/client";

interface BlogPostProductInput {
  productId: string;
  sortOrder?: number;
}

interface CreateBlogPostInput {
  title: string;
  content: string;
  authorId: string;
  excerpt?: string;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: BlogPostStatus;
  publishedAt?: Date;
  scheduledAt?: Date;
  categoryId?: string;
  products?: BlogPostProductInput[];
}

interface UpdateBlogPostInput {
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: BlogPostStatus;
  publishedAt?: Date;
  scheduledAt?: Date;
  categoryId?: string;
  products?: BlogPostProductInput[];
}

interface ListBlogPostsInput {
  search?: string;
  categoryId?: string;
}

interface ListAdminBlogPostsInput {
  search?: string;
  categoryId?: string;
  status?: BlogPostStatus;
}

const blogPostInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },

  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },

  products: {
    orderBy: {
      sortOrder: "asc" as const,
    },

    select: {
      id: true,
      sortOrder: true,

      product: {
        select: {
          id: true,
          title: true,
          slug: true,
          shortDescription: true,
          imageUrl: true,
          price: true,
          originalPrice: true,
          currency: true,
          rating: true,
          reviewsCount: true,
          affiliateUrl: true,
          available: true,
          featured: true,
          active: true,
        },
      },
    },
  },
};

function serializeBlogPost(post: any) {
  return {
    ...post,

    products: post.products.map((item: any) => ({
      id: item.id,
      sortOrder: item.sortOrder,
      product: item.product,
    })),
  };
}

function serializeBlogPosts(posts: any[]) {
  return posts.map(serializeBlogPost);
}

function createBlogSlug(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const blogService = {
  async list(input: ListBlogPostsInput = {}) {
    const where: {
      status: BlogPostStatus;
      OR?: Array<{
        title?: {
          contains: string;
          mode: "insensitive";
        };
        excerpt?: {
          contains: string;
          mode: "insensitive";
        };
        content?: {
          contains: string;
          mode: "insensitive";
        };
      }>;
      categoryId?: string;
    } = {
      status: BlogPostStatus.PUBLISHED,
    };

    if (input.search !== undefined) {
      where.OR = [
        {
          title: {
            contains: input.search,
            mode: "insensitive",
          },
        },
        {
          excerpt: {
            contains: input.search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: input.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (input.categoryId !== undefined) {
      where.categoryId = input.categoryId;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: blogPostInclude,
      orderBy: {
        publishedAt: "desc",
      },
    });

    return serializeBlogPosts(posts);
  },

  async listAdmin(input: ListAdminBlogPostsInput = {}) {
    const where: {
      OR?: Array<{
        title?: {
          contains: string;
          mode: "insensitive";
        };
        excerpt?: {
          contains: string;
          mode: "insensitive";
        };
        content?: {
          contains: string;
          mode: "insensitive";
        };
      }>;
      categoryId?: string;
      status?: BlogPostStatus;
    } = {};

    if (input.search !== undefined) {
      where.OR = [
        {
          title: {
            contains: input.search,
            mode: "insensitive",
          },
        },
        {
          excerpt: {
            contains: input.search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: input.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (input.categoryId !== undefined) {
      where.categoryId = input.categoryId;
    }

    if (input.status !== undefined) {
      where.status = input.status;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: blogPostInclude,
      orderBy: {
        createdAt: "desc",
      },
    });

    return serializeBlogPosts(posts);
  },

  async findById(id: string) {
    const post = await prisma.blogPost.findUnique({
      where: {
        id,
      },
      include: blogPostInclude,
    });

    if (!post) {
      return null;
    }

    return serializeBlogPost(post);
  },

  async findBySlug(slug: string) {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
      },
      include: blogPostInclude,
    });

    if (!post) {
      return null;
    }

    return serializeBlogPost(post);
  },

  async findBySlugExceptId(slug: string, id: string) {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
      include: blogPostInclude,
    });

    if (!post) {
      return null;
    }

    return serializeBlogPost(post);
  },

  async create(data: CreateBlogPostInput) {
    const postData = {
      title: data.title,
      slug: createBlogSlug(data.title),
      content: data.content,

      author: {
        connect: {
          id: data.authorId,
        },
      },

      ...(data.excerpt !== undefined
        ? {
            excerpt: data.excerpt,
          }
        : {}),

      ...(data.coverImage !== undefined
        ? {
            coverImage: data.coverImage,
          }
        : {}),

      ...(data.seoTitle !== undefined
        ? {
            seoTitle: data.seoTitle,
          }
        : {}),

      ...(data.seoDescription !== undefined
        ? {
            seoDescription: data.seoDescription,
          }
        : {}),

      ...(data.status !== undefined
        ? {
            status: data.status,
          }
        : {}),

      ...(data.publishedAt !== undefined
        ? {
            publishedAt: data.publishedAt,
          }
        : {}),

      ...(data.scheduledAt !== undefined
        ? {
            scheduledAt: data.scheduledAt,
          }
        : {}),

      ...(data.categoryId !== undefined
        ? {
            category: {
              connect: {
                id: data.categoryId,
              },
            },
          }
        : {}),

      ...(data.products !== undefined && data.products.length > 0
        ? {
            products: {
              create: data.products.map((product) => ({
                sortOrder: product.sortOrder ?? 0,

                product: {
                  connect: {
                    id: product.productId,
                  },
                },
              })),
            },
          }
        : {}),
    };

    const post = await prisma.blogPost.create({
      data: postData,
      include: blogPostInclude,
    });

    return serializeBlogPost(post);
  },

  async update(id: string, data: UpdateBlogPostInput) {
    const postData = {
      ...(data.title !== undefined
        ? {
            title: data.title,
            slug: createBlogSlug(data.title),
          }
        : {}),

      ...(data.excerpt !== undefined
        ? {
            excerpt: data.excerpt,
          }
        : {}),

      ...(data.content !== undefined
        ? {
            content: data.content,
          }
        : {}),

      ...(data.coverImage !== undefined
        ? {
            coverImage: data.coverImage,
          }
        : {}),

      ...(data.seoTitle !== undefined
        ? {
            seoTitle: data.seoTitle,
          }
        : {}),

      ...(data.seoDescription !== undefined
        ? {
            seoDescription: data.seoDescription,
          }
        : {}),

      ...(data.status !== undefined
        ? {
            status: data.status,
          }
        : {}),

      ...(data.publishedAt !== undefined
        ? {
            publishedAt: data.publishedAt,
          }
        : {}),

      ...(data.scheduledAt !== undefined
        ? {
            scheduledAt: data.scheduledAt,
          }
        : {}),
    };

    const post = await prisma.$transaction(async (transaction) => {
      if (data.products !== undefined) {
        await transaction.blogPostProduct.deleteMany({
          where: {
            postId: id,
          },
        });
      }

      const updatedPost = await transaction.blogPost.update({
        where: {
          id,
        },

        data: {
          ...postData,

          ...(data.categoryId !== undefined
            ? {
                category: {
                  connect: {
                    id: data.categoryId,
                  },
                },
              }
            : {}),

          ...(data.products !== undefined
            ? {
                products: {
                  create: data.products.map((product) => ({
                    sortOrder: product.sortOrder ?? 0,

                    product: {
                      connect: {
                        id: product.productId,
                      },
                    },
                  })),
                },
              }
            : {}),
        },

        include: blogPostInclude,
      });

      return updatedPost;
    });

    return serializeBlogPost(post);
  },

  async delete(id: string) {
    await prisma.blogPost.delete({
      where: {
        id,
      },
    });
  },
};
```

## src\services\categories-service.ts

```ts
import { prisma } from "@/database/prisma";

export const categoryService = {
  async create(data: any) {
    return prisma.category.create({
      data,
    });
  },

  async list() {
    return prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });
  },

  async get(id: string) {
    return prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        subcategories: true,
      },
    });
  },

  async update(id: string, data: any) {
    return prisma.category.update({
      where: {
        id,
      },
      data,
    });
  },

  async delete(id: string) {
    return prisma.category.delete({
      where: {
        id,
      },
    });
  },
};
```

## src\services\marketplace-service.ts

```ts
import { prisma } from "@/database/prisma";

export const marketplaceService = {
  async create(data: any) {
    return prisma.marketplace.create({
      data,
    });
  },

  async list() {
    return prisma.marketplace.findMany({
      include: {
        products: true,
      },
    });
  },

  async get(id: string) {
    return prisma.marketplace.findUnique({
      where: {
        id,
      },
      include: {
        products: true,
      },
    });
  },

  async update(id: string, data: any) {
    return prisma.marketplace.update({
      where: {
        id,
      },
      data,
    });
  },

  async delete(id: string) {
    return prisma.marketplace.delete({
      where: {
        id,
      },
    });
  },
};
```

## src\services\mercado-livre\mercado-livre.api.ts

```ts
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
```

## src\services\mercado-livre\mercado-livre.auth.ts

```ts
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
```

## src\services\mercado-livre\mercado-livre.helpers.ts

```ts
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
```

## src\services\mercado-livre\mercado-livre.service.ts

```ts
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

    featured: input.featured ?? false,

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
```

## src\services\mercado-livre\mercado-livre.types.ts

```ts
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
```

## src\services\mercado-livre-service.ts

```ts
export {
  analyzeMercadoLivreExternalLink,
  connectMercadoLivre,
  findCatalogOfferByItem,
  getMercadoLivreAuthorizationUrl,
  getMercadoLivreProducts,
  importMercadoLivreProduct,
  recoverLegacyProduct,
  syncMercadoLivreProducts,
  updateMercadoLivreProductOffer,
} from "./mercado-livre/mercado-livre.service";

export type {
  ImportImageInput,
  ImportInput,
  UpdateMercadoLivreProductOfferInput,
} from "./mercado-livre/mercado-livre.types";
```

## src\services\products-service.ts

```ts
import { prisma } from "@/database/prisma";

type ProductImageInput = {
  imageUrl: string;
  sortOrder?: number | undefined;
};

type CreateProductInput = {
  title: string;
  description?: string | undefined;
  shortDescription?: string | undefined;
  imageUrl: string;
  images?: ProductImageInput[] | undefined;
  price: number;
  originalPrice?: number | undefined;
  currency: string;
  rating?: number | undefined;
  reviewsCount?: number | undefined;
  affiliateUrl: string;
  subcategoryId: string;
  marketplaceId: string;
  featured?: boolean | undefined;
  destaque?: boolean | undefined;
  bestSeller?: boolean | undefined;
  available?: boolean | undefined;
  active?: boolean | undefined;
  seoTitle?: string | undefined;
  seoDescription?: string | undefined;
};

type UpdateProductInput = {
  title?: string | undefined;
  description?: string | undefined;
  shortDescription?: string | undefined;
  imageUrl?: string | undefined;
  images?: ProductImageInput[] | undefined;
  price?: number | undefined;
  originalPrice?: number | undefined;
  currency?: string | undefined;
  rating?: number | undefined;
  reviewsCount?: number | undefined;
  affiliateUrl?: string | undefined;
  subcategoryId?: string | undefined;
  marketplaceId?: string | undefined;
  featured?: boolean | undefined;
  destaque?: boolean | undefined;
  bestSeller?: boolean | undefined;
  available?: boolean | undefined;
  active?: boolean | undefined;
  seoTitle?: string | undefined;
  seoDescription?: string | undefined;
};

type ProductStatusInput = {
  active?: boolean | undefined;
  available?: boolean | undefined;
  featured?: boolean | undefined;
  destaque?: boolean | undefined;
  bestSeller?: boolean | undefined;
};

type ProductSort = "recent" | "price_asc" | "price_desc" | "rating";

type ProductQuery = {
  search?: string | undefined;
  category?: string | undefined;
  subcategoryId?: string | undefined;
  marketplaceId?: string | undefined;
  featured?: boolean | undefined;
  destaque?: boolean | undefined;
  bestSeller?: boolean | undefined;
  page?: number | undefined;
  limit?: number | undefined;
  sort?: ProductSort | undefined;
};

type ProductAdminQuery = {
  search?: string | undefined;
  subcategoryId?: string | undefined;
  marketplaceId?: string | undefined;
  featured?: boolean | undefined;
  destaque?: boolean | undefined;
  bestSeller?: boolean | undefined;
  active?: boolean | undefined;
  available?: boolean | undefined;
};

type ProductWithRelations = {
  subcategory?: {
    name?: string;
    slug?: string;
    category?: {
      id?: string;
      name: string;
      slug?: string;
    } | null;
  } | null;

  images?: Array<{
    id: string;
    imageUrl: string;
    sortOrder: number;
  }>;

  marketplaceProducts?: Array<{
    id: string;
    productId: string;
    marketplaceId: string;
    externalId: string;
    catalogProductId: string | null;
    itemId: string | null;
    sellerId: string | null;
    externalLink: string | null;
    affiliateUrl: string;
    price: unknown;
    originalPrice: unknown;
    currency: string;
    rating: unknown;
    reviewsCount: number;
    available: boolean;
    syncStatus: string;
    lastSyncedAt: Date | null;
    lastSyncError: string | null;
  }>;

  [key: string]: unknown;
};

function serializeProduct<T extends ProductWithRelations>(product: T) {
  const { subcategory, ...productData } = product;

  return {
    ...productData,
    category: subcategory?.category?.name ?? null,
  };
}

function serializeProducts<T extends ProductWithRelations>(products: T[]) {
  return products.map(serializeProduct);
}

export const productsService = {
  async list(query: ProductQuery = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 24;
    const skip = (page - 1) * limit;
    const sort = query.sort ?? "recent";

    const where = {
      active: true,
      available: true,

      ...(query.search
        ? {
            OR: [
              {
                title: {
                  contains: query.search,
                  mode: "insensitive" as const,
                },
              },
              {
                description: {
                  contains: query.search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),

      ...(query.category
        ? {
            subcategory: {
              category: {
                OR: [
                  {
                    slug: {
                      equals: query.category,
                      mode: "insensitive" as const,
                    },
                  },
                  {
                    name: {
                      equals: query.category,
                      mode: "insensitive" as const,
                    },
                  },
                ],
              },
            },
          }
        : {}),

      ...(query.subcategoryId
        ? {
            subcategoryId: query.subcategoryId,
          }
        : {}),

      ...(query.marketplaceId
        ? {
            marketplaceId: query.marketplaceId,
          }
        : {}),

      ...(query.featured !== undefined
        ? {
            featured: query.featured,
          }
        : {}),

      ...(query.destaque !== undefined
        ? {
            destaque: query.destaque,
          }
        : {}),

      ...(query.bestSeller !== undefined
        ? {
            bestSeller: query.bestSeller,
          }
        : {}),
    };

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" as const }
        : sort === "price_desc"
          ? { price: "desc" as const }
          : sort === "rating"
            ? { rating: "desc" as const }
            : { createdAt: "desc" as const };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,

        include: {
          subcategory: {
            include: {
              category: true,
            },
          },

          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },

        orderBy,

        skip,
        take: limit,
      }),

      prisma.product.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      products: serializeProducts(products),

      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  async listAdmin(query: ProductAdminQuery = {}) {
    const products = await prisma.product.findMany({
      where: {
        ...(query.search
          ? {
              OR: [
                {
                  title: {
                    contains: query.search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: query.search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),

        ...(query.subcategoryId
          ? {
              subcategoryId: query.subcategoryId,
            }
          : {}),

        ...(query.marketplaceId
          ? {
              marketplaceId: query.marketplaceId,
            }
          : {}),

        ...(query.featured !== undefined
          ? {
              featured: query.featured,
            }
          : {}),

        ...(query.destaque !== undefined
          ? {
              destaque: query.destaque,
            }
          : {}),

        ...(query.bestSeller !== undefined
          ? {
              bestSeller: query.bestSeller,
            }
          : {}),

        ...(query.active !== undefined
          ? {
              active: query.active,
            }
          : {}),

        ...(query.available !== undefined
          ? {
              available: query.available,
            }
          : {}),
      },

      include: {
        subcategory: {
          include: {
            category: true,
          },
        },

        marketplace: true,

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return serializeProducts(products);
  },

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        subcategory: {
          include: {
            category: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },

        marketplaceProducts: true,
      },
    });

    if (!product) {
      return null;
    }

    return serializeProduct(product);
  },

  async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },

      include: {
        subcategory: {
          include: {
            category: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return serializeProduct(product);
  },

  async findBySlugExceptId(slug: string, id: string) {
    return prisma.product.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
    });
  },

  async create(data: CreateProductInput) {
    const slug = createProductSlug(data.title);

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug,

        ...(data.description !== undefined
          ? {
              description: data.description,
            }
          : {}),

        ...(data.shortDescription !== undefined
          ? {
              shortDescription: data.shortDescription,
            }
          : {}),

        imageUrl: data.imageUrl,

        price: data.price,

        ...(data.originalPrice !== undefined
          ? {
              originalPrice: data.originalPrice,
            }
          : {}),

        currency: data.currency,

        ...(data.rating !== undefined
          ? {
              rating: data.rating,
            }
          : {}),

        reviewsCount: data.reviewsCount ?? 0,

        affiliateUrl: data.affiliateUrl,

        available: data.available ?? true,
        featured: data.featured ?? false,
        destaque: data.destaque ?? false,
        bestSeller: data.bestSeller ?? false,
        active: data.active ?? true,

        ...(data.seoTitle !== undefined
          ? {
              seoTitle: data.seoTitle,
            }
          : {}),

        ...(data.seoDescription !== undefined
          ? {
              seoDescription: data.seoDescription,
            }
          : {}),

        subcategory: {
          connect: {
            id: data.subcategoryId,
          },
        },

        marketplace: {
          connect: {
            id: data.marketplaceId,
          },
        },

        ...(data.images !== undefined
          ? {
              images: {
                create: data.images.map((image, index) => ({
                  imageUrl: image.imageUrl,
                  sortOrder: image.sortOrder ?? index,
                })),
              },
            }
          : {}),
      },

      include: {
        subcategory: {
          include: {
            category: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return serializeProduct(product);
  },

  async update(id: string, data: UpdateProductInput) {
    const product = await prisma.$transaction(async (tx) => {
      if (data.images !== undefined) {
        await tx.productImage.deleteMany({
          where: {
            productId: id,
          },
        });
      }

      const updatedProduct = await tx.product.update({
        where: {
          id,
        },

        data: {
          ...(data.title !== undefined
            ? {
                title: data.title,
                slug: createProductSlug(data.title),
              }
            : {}),

          ...(data.description !== undefined
            ? {
                description: data.description,
              }
            : {}),

          ...(data.shortDescription !== undefined
            ? {
                shortDescription: data.shortDescription,
              }
            : {}),

          ...(data.imageUrl !== undefined
            ? {
                imageUrl: data.imageUrl,
              }
            : {}),

          ...(data.price !== undefined
            ? {
                price: data.price,
              }
            : {}),

          ...(data.originalPrice !== undefined
            ? {
                originalPrice: data.originalPrice,
              }
            : {}),

          ...(data.currency !== undefined
            ? {
                currency: data.currency,
              }
            : {}),

          ...(data.rating !== undefined
            ? {
                rating: data.rating,
              }
            : {}),

          ...(data.reviewsCount !== undefined
            ? {
                reviewsCount: data.reviewsCount,
              }
            : {}),

          ...(data.affiliateUrl !== undefined
            ? {
                affiliateUrl: data.affiliateUrl,
              }
            : {}),

          ...(data.available !== undefined
            ? {
                available: data.available,
              }
            : {}),

          ...(data.featured !== undefined
            ? {
                featured: data.featured,
              }
            : {}),

          ...(data.destaque !== undefined
            ? {
                destaque: data.destaque,
              }
            : {}),

          ...(data.bestSeller !== undefined
            ? {
                bestSeller: data.bestSeller,
              }
            : {}),

          ...(data.active !== undefined
            ? {
                active: data.active,
              }
            : {}),

          ...(data.seoTitle !== undefined
            ? {
                seoTitle: data.seoTitle,
              }
            : {}),

          ...(data.seoDescription !== undefined
            ? {
                seoDescription: data.seoDescription,
              }
            : {}),

          ...(data.subcategoryId !== undefined
            ? {
                subcategory: {
                  connect: {
                    id: data.subcategoryId,
                  },
                },
              }
            : {}),

          ...(data.marketplaceId !== undefined
            ? {
                marketplace: {
                  connect: {
                    id: data.marketplaceId,
                  },
                },
              }
            : {}),

          ...(data.images !== undefined
            ? {
                images: {
                  create: data.images.map((image, index) => ({
                    imageUrl: image.imageUrl,
                    sortOrder: image.sortOrder ?? index,
                  })),
                },
              }
            : {}),
        },

        include: {
          subcategory: {
            include: {
              category: true,
            },
          },

          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });

      return updatedProduct;
    });

    return serializeProduct(product);
  },

  async updateStatus(id: string, data: ProductStatusInput) {
    const product = await prisma.product.update({
      where: {
        id,
      },

      data: {
        ...(data.active !== undefined
          ? {
              active: data.active,
            }
          : {}),

        ...(data.available !== undefined
          ? {
              available: data.available,
            }
          : {}),

        ...(data.featured !== undefined
          ? {
              featured: data.featured,
            }
          : {}),

        ...(data.destaque !== undefined
          ? {
              destaque: data.destaque,
            }
          : {}),

        ...(data.bestSeller !== undefined
          ? {
              bestSeller: data.bestSeller,
            }
          : {}),
      },

      include: {
        subcategory: {
          include: {
            category: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return serializeProduct(product);
  },
};

function createProductSlug(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

## src\services\search-service.ts

```ts
import { prisma } from "@/database/prisma";

export const searchService = {
  async search(query: string) {
    const search = query.trim();

    if (!search) {
      return {
        products: [],
        categories: [],
        subcategories: [],
      };
    }

    const [products, categories, subcategories] = await Promise.all([
      prisma.product.findMany({
        where: {
          active: true,
          available: true,
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              shortDescription: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              subcategory: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              subcategory: {
                category: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        },
        include: {
          subcategory: {
            include: {
              category: true,
            },
          },
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      }),

      prisma.category.findMany({
        where: {
          active: true,
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          sortOrder: "asc",
        },
        take: 20,
      }),

      prisma.subcategory.findMany({
        where: {
          active: true,
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          category: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
        take: 20,
      }),
    ]);

    return {
      products: products.map((product) => {
        const { subcategory, ...productData } = product;

        return {
          ...productData,
          category: subcategory?.category?.name ?? null,
        };
      }),

      categories,

      subcategories,
    };
  },
};
```

## src\services\subcategories-services.ts

```ts
import { prisma } from "@/database/prisma";

export const subcategoriesService = {
  async create(data: any) {
    return prisma.subcategory.create({
      data,
    });
  },

  async list() {
    return prisma.subcategory.findMany({
      include: {
        category: true,
        products: true,
      },
    });
  },

  async get(id: string) {
    return prisma.subcategory.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        products: true,
      },
    });
  },

  async update(id: string, data: any) {
    return prisma.subcategory.update({
      where: {
        id,
      },
      data,
    });
  },

  async delete(id: string) {
    return prisma.subcategory.delete({
      where: {
        id,
      },
    });
  },
};
```

## src\types\aliases.d.ts

```ts
declare module "@/*";
```

## src\types\express\index.d.ts

```ts
declare namespace Express {
  export interface Request {
    user: {
      id: string;
      role: string;
    };
  }
}
```

## src\utils\AppError.ts

```ts
class AppError {
  message: string;
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export { AppError };
```

## src\utils\createSlug.ts

```ts
export function createSlug(value: string, suffix?: string) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!suffix) {
    return slug;
  }

  return `${slug}-${suffix}`;
}
```

## tools\generate-md.ts

```ts
import {
  readdirSync,
  statSync,
  readFileSync,
  appendFileSync,
  existsSync,
  unlinkSync,
} from "fs";
import { join, extname, dirname, resolve, relative, basename } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// raiz do projeto (um nível acima de tools)
const projectPath = resolve(__dirname, "..");

// pega o nome da pasta raiz (nome do projeto)
const projectName = basename(projectPath);

// gera o arquivo dentro de tools com o nome do projeto
const outputFile = join(__dirname, `${projectName}.md`);

const extensions = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".env",
  ".css",
];
const specialFiles = [
  "Dockerfile",
  "Makefile",
  ".eslintrc",
  ".prettierrc",
  "vite.config.ts",
  "vite.config.js",
  "tailwind.config.js",
  "postcss.config.js",
];
const excludeDirs = ["node_modules", ".git", "dist", "build", "generated"];
const excludeFiles = ["package-lock.json"];

if (existsSync(outputFile)) unlinkSync(outputFile);

function formatHeader(fullPath: string): string {
  const rel = relative(projectPath, fullPath);
  return `## ${rel}`;
}

function wrapContent(ext: string, content: string): string {
  if ([".ts", ".tsx", ".js"].includes(ext))
    return `\n\`\`\`${ext.replace(".", "")}\n${content}\n\`\`\`\n`;
  if (ext === ".json") return `\n\`\`\`json\n${content}\n\`\`\`\n`;
  if (ext === ".md") return `\n${content}\n`;
  if (ext === ".env") return `\n\`\`\`env\n${content}\n\`\`\`\n`;
  if (specialFiles.includes(ext)) return `\n\`\`\`\n${content}\n\`\`\`\n`;
  return `\n${content}\n`;
}

function walk(dir: string): void {
  for (const file of readdirSync(dir)) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) walk(fullPath);
    } else {
      const ext = extname(file) || file;
      if (
        (extensions.includes(ext) || specialFiles.includes(file)) &&
        !excludeFiles.includes(file)
      ) {
        try {
          const content = readFileSync(fullPath, "utf8");
          appendFileSync(outputFile, `\n${formatHeader(fullPath)}\n`);
          appendFileSync(outputFile, wrapContent(ext, content));
        } catch (err) {
          console.error(
            "⚠️ Erro ao ler arquivo:",
            fullPath,
            (err as Error).message,
          );
        }
      }
    }
  }
}

console.log(`🔍 Gerando arquivo ${projectName}.md...`);
walk(projectPath);
console.log(`✅ Arquivo gerado com sucesso em ${outputFile}`);
```

## tools\instrucoes.md

📘 Guia de Uso — Script `generate-md.ts`

Este utilitário percorre todo o projeto (backend ou frontend) e gera um arquivo `.md` com o conteúdo dos arquivos, formatado em Markdown e destacado por tipo de código.

---

## 🛠️ Estrutura do Projeto

```
meu-projeto/
├─ backend/
│   ├─ src/
│   └─ tools/
│       └─ generate-md.ts
├─ frontend/
│   ├─ src/
│   └─ tools/
│       └─ generate-md.ts
├─ package.json
└─ tsconfig.json
---
```

## 📂 Script `generate-md.ts`

Coloque este arquivo dentro da pasta `tools` de cada parte (backend e frontend):

```ts
import {
  readdirSync,
  statSync,
  readFileSync,
  appendFileSync,
  existsSync,
  unlinkSync,
} from "fs";
import { join, extname, dirname, resolve, relative, basename } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// raiz do projeto (um nível acima da pasta tools)
const projectPath = resolve(__dirname, "..");

// nome da pasta raiz (ex: backend ou frontend)
const projectName = basename(projectPath);

// arquivo de saída dentro da pasta tools
const outputFile = join(__dirname, `${projectName}.md`);

const extensions = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".env",
  ".css",
];
const specialFiles = [
  "Dockerfile",
  "Makefile",
  ".eslintrc",
  ".prettierrc",
  "vite.config.ts",
  "vite.config.js",
  "tailwind.config.js",
  "postcss.config.js",
];
const excludeDirs = ["node_modules", ".git", "dist", "build", "generated"];
const excludeFiles = ["package-lock.json"];

if (existsSync(outputFile)) unlinkSync(outputFile);

function formatHeader(fullPath: string): string {
  const rel = relative(projectPath, fullPath);
  return `## ${rel}`;
}

function wrapContent(ext: string, content: string): string {
  if ([".ts", ".tsx", ".js", ".jsx"].includes(ext))
    return `\n\`\`\`${ext.replace(".", "")}\n${content}\n\`\`\`\n`;
  if (ext === ".json") return `\n\`\`\`json\n${content}\n\`\`\`\n`;
  if (ext === ".md") return `\n${content}\n`;
  if (ext === ".env") return `\n\`\`\`env\n${content}\n\`\`\`\n`;
  if (ext === ".css") return `\n\`\`\`css\n${content}\n\`\`\`\n`;
  if (specialFiles.includes(ext)) return `\n\`\`\`\n${content}\n\`\`\`\n`;
  return `\n${content}\n`;
}

function walk(dir: string): void {
  for (const file of readdirSync(dir)) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) walk(fullPath);
    } else {
      const ext = extname(file) || file;
      if (
        (extensions.includes(ext) || specialFiles.includes(file)) &&
        !excludeFiles.includes(file)
      ) {
        try {
          const content = readFileSync(fullPath, "utf8");
          appendFileSync(outputFile, `\n${formatHeader(fullPath)}\n`);
          appendFileSync(outputFile, wrapContent(ext, content));
        } catch (err) {
          console.error(
            "⚠️ Erro ao ler arquivo:",
            fullPath,
            (err as Error).message,
          );
        }
      }
    }
  }
}

console.log(`🔍 Gerando arquivo ${projectName}.md...`);
walk(projectPath);
console.log(`✅ Arquivo gerado com sucesso em ${outputFile}`);
```

⚙️ Configuração do TypeScript

- No tsconfig.json da raiz, adicione:

```
{
  "compilerOptions": {
    "module": "ESNext",
    "target": "ES2020",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "types": ["node"]
  },
  "include": ["src", "tools"]
}
```

📦 Dependências

- Instale:

```
"scripts": {
  "generate-md": "tsx tools/generate-md.ts"
}

```

🚀 Como Rodar

- No terminal, vá até a pasta desejada e rode:

```
npm run generate-md
```

## tools\WorldMix360-API.md

## .env

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/world_mix360?schema=public"

JWT_SECRET=r0s3nd0

PRODUCT_SYNC_SECRET=3ee7524986e159cb3c02a833149821f25ede1614dc0944ded3451cd550c04550

MELI_CLIENT_ID=6660819157435013

MELI_CLIENT_SECRET=dEH7J1bZoqqMcEgBKhllAvlnUlyzKQZM

MELI_REDIRECT_URI=https://infrastructure-shorts-stroke-entities.trycloudflare.com/mercado-livre/callback
```

## env.d.ts

```ts
export declare const env: {
  DATABASE_URL: string;
  JWT_SECRET: string;
};
//# sourceMappingURL=env.d.ts.map
```

## env.js

```js
import process from "process";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
});
export const env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map
```

## env.ts

```ts
import "dotenv/config";
import process from "process";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  MELI_CLIENT_ID: z.string().optional(),
  MELI_CLIENT_SECRET: z.string().optional(),
  MELI_REDIRECT_URI: z.string().url().optional(),
  WEB_URL: z.string().url().default("http://localhost:5173"),
  CORS_ORIGIN: z.string().url().default("http://localhost:5173"),
  PRODUCT_SYNC_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

## package.json

```json
{
  "name": "worldmix360-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "tsx --watch -r tsconfig-paths/register src/server.ts",
    "generate-md": "tsx tools/generate-md.ts",
    "db:migrate": "prisma migrate deploy",
    "db:dev": "prisma migrate dev",
    "db:studio": "prisma studio",
    "build": "tsc && tsc-alias --resolve-full-paths",
    "start": "node dist/src/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "@prisma/adapter-pg": "^7.10.0",
    "@prisma/client": "^7.10.0",
    "bcrypt": "^6.0.0",
    "cheerio": "^1.2.0",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.23.0",
    "playwright": "^1.63.0",
    "tsconfig-paths": "^4.2.0",
    "zod": "^4.5.4"
  },
  "devDependencies": {
    "@types/bcrypt": "^6.0.0",
    "@types/express": "^5.0.6",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/node": "^26.4.0",
    "@types/pg": "^8.23.1",
    "prisma": "^7.10.0",
    "ts-node": "^10.9.2",
    "tsc-alias": "^1.9.3",
    "tsx": "^4.23.13",
    "typescript": "^7.0.2"
  }
}
```

## prisma7.config.ts

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

## README.md

# WorldMix360 API

API Express + TypeScript + Prisma, preparada para usar PostgreSQL local ou hospedado.

## Desenvolvimento local

Requisitos: Node.js 20+ e PostgreSQL acessível.

Com Docker Desktop instalado e iniciado:

```bash
docker compose up -d
npm install
npx prisma generate
npm run db:dev
npm run dev
```

A API ficará em `http://localhost:3333` e o Studio em:

```bash
npm run db:studio
```

Se o Docker não estiver disponível, configure o `DATABASE_URL` no `.env` com a URL externa de qualquer PostgreSQL. O código não depende de Docker.

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

- `DATABASE_URL`: URL do PostgreSQL. Em provedores externos, use a URL pública e `sslmode=require` quando exigido.
- `JWT_SECRET`: segredo forte para as sessões da API.
- `MELI_CLIENT_ID`, `MELI_CLIENT_SECRET` e `MELI_REDIRECT_URI`: credenciais OAuth do Mercado Livre.
- `WEB_URL` e `CORS_ORIGIN`: URL pública do frontend.
- `PRODUCT_SYNC_SECRET`: segredo usado no header `x-sync-token` para sincronizar produtos.

## Produção

O provedor deve executar:

```bash
npm ci
npx prisma generate
npm run db:migrate
npm run build
npm start
```

O servidor usa a variável `PORT` fornecida pelo provedor e, caso ela não exista, usa `3333`.

No Render, o arquivo `render.yaml` já define esses comandos. Em Hostinger ou outro VPS, use os mesmos comandos em um serviço Node, configure as variáveis no painel e aponte `DATABASE_URL` para o PostgreSQL hospedado.

## Endpoints principais

```text
GET  /health
GET  /mercado-livre/authorize
GET  /mercado-livre/callback
GET  /products
POST /products/sync  (header x-sync-token)
```

## skills-lock.json

```json
{
  "version": 1,
  "skills": {
    "prisma-cli": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-cli/SKILL.md",
      "computedHash": "b92e55aef78f6796d81433c44738a6733211a04c16e65cbad6d42c5f71092aab"
    },
    "prisma-client-api": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-client-api/SKILL.md",
      "computedHash": "5dcc0793337151efa73a444e5adbc7e1c24180778e83b4fe94c9109c391bd333"
    },
    "prisma-compute": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-compute/SKILL.md",
      "computedHash": "fbbdcf3e01ed876113d18804d38d17359d9f7ba7a4bd353193673d5924f19818"
    },
    "prisma-database-setup": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-database-setup/SKILL.md",
      "computedHash": "0911d9454bd48df3badd23a50fd90a280eabb15dcbd472c14e7b729075dadefb"
    },
    "prisma-driver-adapter-implementation": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-driver-adapter-implementation/SKILL.md",
      "computedHash": "07484627aea6cce4d0f94b4090ff9acc0caa7e104f9988b95abecf80132f4103"
    },
    "prisma-mongodb-upgrade": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-mongodb-upgrade/SKILL.md",
      "computedHash": "f9ba440e88ca4cec9801d04762296e29e99ca08cb8a8156e4f783ecf90279c8f"
    },
    "prisma-postgres": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-postgres/SKILL.md",
      "computedHash": "d669fbd0d8017d16c967f18b20e1c1345cd4a2a0076d762459bfef79f551f655"
    },
    "prisma-postgres-setup": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-postgres-setup/SKILL.md",
      "computedHash": "c89d3aa91285d8e4964fcaa5238c99a3d3c20b617e032e731cf632330a85a5a6"
    },
    "prisma-upgrade-v7": {
      "source": "prisma/skills",
      "sourceType": "github",
      "skillPath": "prisma-upgrade-v7/SKILL.md",
      "computedHash": "dcc6c71adca6b22f37c5bda5ac7fd63c3bb59495596a22e06a29c7c85371558f"
    }
  }
}
```

## src\app.ts

```ts
import express from "express";

import { mercadoLivreConfig } from "./configs/mercado-livre";
import { errorHandling } from "./middleware/error-handling";
import { routes } from "./routes";

const app = express();

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", mercadoLivreConfig.corsOrigin);

  response.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  response.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );

  if (request.method === "OPTIONS") {
    return response.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.get("/health", (_request, response) => {
  return response.json({ status: "ok" });
});

app.use(routes);

app.use(errorHandling);

export { app };
```

## src\configs\auth.ts

```ts
import { env } from "../../env";

export interface AuthConfigProps {
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: "1d",
  },
};
```

## src\configs\mercado-livre.ts

```ts
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
```

## src\controllers\blog-categories-controller.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";

import { blogCategoriesService } from "@/services/blog-categories-service";
import { createSlug } from "@/utils/createSlug";

const createBlogCategorySchema = z.object({
  name: z.string().trim().min(1, "O nome da categoria é obrigatório"),
  description: z.string().trim().optional(),
  image: z.string().trim().url("A imagem deve ser uma URL válida").optional(),
  active: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});

const updateBlogCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome da categoria é obrigatório")
    .optional(),
  description: z.string().trim().optional(),
  image: z.string().trim().url("A imagem deve ser uma URL válida").optional(),
  active: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});

const idSchema = z.object({
  id: z.string().uuid("ID da categoria do blog inválido"),
});

const slugSchema = z.object({
  slug: z.string().trim().min(1, "Slug inválido"),
});

export class BlogCategoriesController {
  async index(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        active: z
          .enum(["true", "false"])
          .transform((value) => value === "true")
          .optional(),
      })
      .parse(request.query);

    const categories = await blogCategoriesService.list({
      ...(query.search !== undefined
        ? {
            search: query.search,
          }
        : {}),
      ...(query.active !== undefined
        ? {
            active: query.active,
          }
        : {}),
    });

    return response.json({
      categories,
    });
  }

  async showById(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const category = await blogCategoriesService.findById(id);

    if (!category) {
      return response.status(404).json({
        message: "Categoria do blog não encontrada",
      });
    }

    return response.json({
      category,
    });
  }

  async showBySlug(request: Request, response: Response) {
    const { slug } = slugSchema.parse(request.params);

    const category = await blogCategoriesService.findBySlug(slug);

    if (!category) {
      return response.status(404).json({
        message: "Categoria do blog não encontrada",
      });
    }

    return response.json({
      category,
    });
  }

  async create(request: Request, response: Response) {
    const data = createBlogCategorySchema.parse(request.body);

    const slug = createSlug(data.name);

    const existingCategory = await blogCategoriesService.findBySlug(slug);

    if (existingCategory) {
      return response.status(409).json({
        message: "Já existe uma categoria do blog com esse nome.",
      });
    }

    const category = await blogCategoriesService.create({
      name: data.name,
      ...(data.description !== undefined
        ? {
            description: data.description,
          }
        : {}),
      ...(data.image !== undefined
        ? {
            image: data.image,
          }
        : {}),
      ...(data.active !== undefined
        ? {
            active: data.active,
          }
        : {}),
      ...(data.sortOrder !== undefined
        ? {
            sortOrder: data.sortOrder,
          }
        : {}),
    });

    return response.status(201).json({
      category,
    });
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const data = updateBlogCategorySchema.parse(request.body);

    const category = await blogCategoriesService.findById(id);

    if (!category) {
      return response.status(404).json({
        message: "Categoria do blog não encontrada",
      });
    }

    let slug: string | undefined;

    if (data.name !== undefined && data.name !== category.name) {
      slug = createSlug(data.name);

      const existingCategory = await blogCategoriesService.findBySlugExceptId(
        slug,
        category.id,
      );

      if (existingCategory) {
        return response.status(409).json({
          message: "Já existe uma categoria do blog com esse nome.",
        });
      }
    }

    const updatedCategory = await blogCategoriesService.update(category.id, {
      ...(data.name !== undefined
        ? {
            name: data.name,
          }
        : {}),
      ...(slug !== undefined
        ? {
            slug,
          }
        : {}),
      ...(data.description !== undefined
        ? {
            description: data.description,
          }
        : {}),
      ...(data.image !== undefined
        ? {
            image: data.image,
          }
        : {}),
      ...(data.active !== undefined
        ? {
            active: data.active,
          }
        : {}),
      ...(data.sortOrder !== undefined
        ? {
            sortOrder: data.sortOrder,
          }
        : {}),
    });

    return response.json({
      category: updatedCategory,
    });
  }

  async delete(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const category = await blogCategoriesService.findById(id);

    if (!category) {
      return response.status(404).json({
        message: "Categoria do blog não encontrada",
      });
    }

    await blogCategoriesService.delete(category.id);

    return response.status(204).send();
  }
}
```

## src\controllers\blog-controller.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";

import { BlogPostStatus } from "@/generated/prisma/client";
import { blogService } from "@/services/blog-service";
import { createSlug } from "@/utils/createSlug";

const blogPostProductSchema = z.object({
  productId: z.string().uuid("ID do produto inválido"),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});

const createBlogPostSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório"),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().min(1, "O conteúdo é obrigatório"),
  coverImage: z.string().trim().url().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),

  status: z.enum(BlogPostStatus).default(BlogPostStatus.DRAFT),

  publishedAt: z.coerce.date().optional(),
  scheduledAt: z.coerce.date().optional(),

  categoryId: z.string().uuid("ID da categoria do blog inválido").optional(),

  products: z.array(blogPostProductSchema).optional(),
});

const updateBlogPostSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório").optional(),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().min(1, "O conteúdo é obrigatório").optional(),
  coverImage: z.string().trim().url().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),

  status: z.enum(BlogPostStatus).optional(),

  publishedAt: z.coerce.date().optional(),
  scheduledAt: z.coerce.date().optional(),

  categoryId: z.string().uuid("ID da categoria do blog inválido").optional(),

  products: z.array(blogPostProductSchema).optional(),
});

const idSchema = z.object({
  id: z.string().uuid("ID do post inválido"),
});

const slugSchema = z.object({
  slug: z.string().trim().min(1, "Slug inválido"),
});

export class BlogController {
  async index(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        categoryId: z.string().uuid().optional(),
      })
      .parse(request.query);

    const posts = await blogService.list({
      ...(query.search !== undefined ? { search: query.search } : {}),

      ...(query.categoryId !== undefined
        ? { categoryId: query.categoryId }
        : {}),
    });

    return response.json({
      posts,
    });
  }

  async indexAdmin(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        categoryId: z.string().uuid().optional(),
        status: z.enum(BlogPostStatus).optional(),
      })
      .parse(request.query);

    const posts = await blogService.listAdmin({
      ...(query.search !== undefined ? { search: query.search } : {}),

      ...(query.categoryId !== undefined
        ? { categoryId: query.categoryId }
        : {}),

      ...(query.status !== undefined ? { status: query.status } : {}),
    });

    return response.json({
      posts,
    });
  }

  async create(request: Request, response: Response) {
    const data = createBlogPostSchema.parse(request.body);

    const slug = createSlug(data.title);

    const existingPost = await blogService.findBySlug(slug);

    if (existingPost) {
      return response.status(409).json({
        message: "Já existe um post com esse título.",
      });
    }

    const post = await blogService.create({
      title: data.title,
      content: data.content,
      authorId: request.user.id,

      ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),

      ...(data.coverImage !== undefined ? { coverImage: data.coverImage } : {}),

      ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),

      ...(data.seoDescription !== undefined
        ? { seoDescription: data.seoDescription }
        : {}),

      ...(data.status !== undefined ? { status: data.status } : {}),

      ...(data.publishedAt !== undefined
        ? { publishedAt: data.publishedAt }
        : {}),

      ...(data.scheduledAt !== undefined
        ? { scheduledAt: data.scheduledAt }
        : {}),

      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),

      ...(data.products !== undefined
        ? {
            products: data.products.map((product) => ({
              productId: product.productId,
              ...(product.sortOrder !== undefined
                ? { sortOrder: product.sortOrder }
                : {}),
            })),
          }
        : {}),
    });

    return response.status(201).json({
      post,
    });
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const data = updateBlogPostSchema.parse(request.body);

    const post = await blogService.findById(id);

    if (!post) {
      return response.status(404).json({
        message: "Post não encontrado",
      });
    }

    if (data.title && data.title !== post.title) {
      const slug = createSlug(data.title);

      const existingPost = await blogService.findBySlugExceptId(slug, post.id);

      if (existingPost) {
        return response.status(409).json({
          message: "Já existe um post com esse título.",
        });
      }
    }

    const updatedPost = await blogService.update(post.id, {
      ...(data.title !== undefined ? { title: data.title } : {}),

      ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),

      ...(data.content !== undefined ? { content: data.content } : {}),

      ...(data.coverImage !== undefined ? { coverImage: data.coverImage } : {}),

      ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),

      ...(data.seoDescription !== undefined
        ? { seoDescription: data.seoDescription }
        : {}),

      ...(data.status !== undefined ? { status: data.status } : {}),

      ...(data.publishedAt !== undefined
        ? { publishedAt: data.publishedAt }
        : {}),

      ...(data.scheduledAt !== undefined
        ? { scheduledAt: data.scheduledAt }
        : {}),

      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),

      ...(data.products !== undefined
        ? {
            products: data.products.map((product) => ({
              productId: product.productId,
              ...(product.sortOrder !== undefined
                ? { sortOrder: product.sortOrder }
                : {}),
            })),
          }
        : {}),
    });

    return response.json({
      post: updatedPost,
    });
  }

  async delete(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const post = await blogService.findById(id);

    if (!post) {
      return response.status(404).json({
        message: "Post não encontrado",
      });
    }

    await blogService.delete(post.id);

    return response.status(204).send();
  }

  async showById(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const post = await blogService.findById(id);

    if (!post) {
      return response.status(404).json({
        message: "Post não encontrado",
      });
    }

    return response.json({
      post,
    });
  }

  async show(request: Request, response: Response) {
    const { slug } = slugSchema.parse(request.params);

    const post = await blogService.findBySlug(slug);

    if (!post) {
      return response.status(404).json({
        message: "Post não encontrado",
      });
    }

    return response.json({
      post,
    });
  }
}
```

## src\controllers\categories-controllers.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { categoryService } from "../services/categories-service";
import { createSlug } from "../utils/createSlug";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome da categoria deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  image: z.string().url("Imagem deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome da categoria deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  image: z.string().url("Imagem deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const idSchema = z.object({
  id: z.string().uuid(),
});

export class CategoryController {
  async create(request: Request, response: Response) {
    const data = createCategorySchema.parse(request.body);

    const slug = createSlug(data.name);

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return response
        .status(409)
        .json({ message: "Já existe uma categoria com esse nome." });
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description ?? null,
        image: data.image ?? null,
      },
    });

    return response.status(201).json({ category });
  }

  async list(req: Request, res: Response) {
    const categories = await categoryService.list();
    return res.json(categories);
  }

  async get(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    const category = await categoryService.get(id);

    if (!category) {
      return res.status(404).json({
        error: "Categoria não encontrada",
      });
    }

    return res.json(category);
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const data = updateCategorySchema.parse(request.body);

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return response.status(404).json({
        message: "Categoria não encontrada",
      });
    }

    let slug = category.slug;

    if (data.name && data.name !== category.name) {
      slug = createSlug(data.name);

      const existingCategory = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: category.id },
        },
      });

      if (existingCategory) {
        return response
          .status(409)
          .json({ message: "Já existe uma categoria com esse nome." });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: category.id,
      },
      data: {
        ...(data.name !== undefined ? { name: data.name, slug } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
        ...(data.active !== undefined ? { active: data.active } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      },
    });

    return response.json({
      category: updatedCategory,
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    await categoryService.delete(id);

    return res.status(204).send();
  }
}
```

## src\controllers\marketplace-controller.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { marketplaceService } from "../services/marketplace-service";
import { createSlug } from "../utils/createSlug";

export const marketplaceSchema = z.object({
  name: z
    .string()
    .min(2, "O nome do marketplace deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  websiteUrl: z.string().url("Website deve ser uma URL válida").optional(),
  logoUrl: z.string().url("Logo deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const createMarketplaceSchema = z.object({
  name: z
    .string()
    .min(2, "O nome do marketplace deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  websiteUrl: z.string().url("Website deve ser uma URL válida").optional(),
  logoUrl: z.string().url("Logo deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const updateMarketplaceSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const idSchema = z.object({
  id: z.string().uuid(),
});

export class MarketplaceController {
  async create(request: Request, response: Response) {
    const data = createMarketplaceSchema.parse(request.body);

    const slug = createSlug(data.name);

    const existingMarketplace = await prisma.marketplace.findUnique({
      where: {
        slug,
      },
    });

    if (existingMarketplace) {
      return response.status(409).json({
        message: "Já existe um marketplace com esse nome.",
      });
    }

    const marketplace = await prisma.marketplace.create({
      data: {
        name: data.name,
        slug,
        description: data.description ?? null,
        websiteUrl: data.websiteUrl ?? null,
        logoUrl: data.logoUrl ?? null,
        active: data.active,
        sortOrder: data.sortOrder,
      },
    });

    return response.status(201).json({
      marketplace,
    });
  }

  async list(req: Request, res: Response) {
    const marketplaces = await marketplaceService.list();

    return res.json(marketplaces);
  }

  async get(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    const marketplace = await marketplaceService.get(id);

    if (!marketplace) {
      return res.status(404).json({
        error: "Marketplace não encontrado",
      });
    }

    return res.json(marketplace);
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const data = updateMarketplaceSchema.parse(request.body);

    const marketplace = await prisma.marketplace.findUnique({
      where: {
        id,
      },
    });

    if (!marketplace) {
      return response.status(404).json({
        message: "Marketplace não encontrado",
      });
    }

    let slug = marketplace.slug;

    if (data.name && data.name !== marketplace.name) {
      slug = createSlug(data.name);

      const existingMarketplace = await prisma.marketplace.findFirst({
        where: {
          slug,
          id: {
            not: marketplace.id,
          },
        },
      });

      if (existingMarketplace) {
        return response.status(409).json({
          message: "Já existe um marketplace com esse nome.",
        });
      }
    }

    const updatedMarketplace = await prisma.marketplace.update({
      where: {
        id: marketplace.id,
      },
      data: {
        ...(data.name !== undefined
          ? {
              name: data.name,
              slug,
            }
          : {}),
        ...(data.description !== undefined
          ? {
              description: data.description,
            }
          : {}),
        ...(data.websiteUrl !== undefined
          ? {
              websiteUrl: data.websiteUrl,
            }
          : {}),
        ...(data.logoUrl !== undefined
          ? {
              logoUrl: data.logoUrl,
            }
          : {}),
        ...(data.active !== undefined
          ? {
              active: data.active,
            }
          : {}),
        ...(data.sortOrder !== undefined
          ? {
              sortOrder: data.sortOrder,
            }
          : {}),
      },
    });

    return response.json({
      marketplace: updatedMarketplace,
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    await marketplaceService.delete(id);

    return res.status(204).send();
  }
}
```

## src\controllers\mercado-livre-controller.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";

import { mercadoLivreConfig } from "@/configs/mercado-livre";

import {
  analyzeMercadoLivreExternalLink,
  connectMercadoLivre,
  getMercadoLivreAuthorizationUrl,
  getMercadoLivreProducts,
  importMercadoLivreProduct,
  syncMercadoLivreProducts,
  updateMercadoLivreProductOffer,
} from "@/services/mercado-livre-service";

const imageSchema = z.object({
  imageUrl: z.string().url(),
  sortOrder: z.number().int().min(0).optional(),
});

const importProductSchema = z.object({
  affiliateUrl: z.string().url(),
  externalLink: z.string().url(),

  catalogProductId: z.string().regex(/^MLB\d+$/i),
  itemId: z.string().regex(/^MLB\d+$/i),
  sellerId: z.string().regex(/^\d+$/),

  subcategoryId: z.string().uuid(),

  title: z.string().min(1),
  description: z.string().optional(),
  shortDescription: z.string().optional(),

  imageUrl: z.string().url().optional(),
  images: z.array(imageSchema).optional(),

  price: z.number().nonnegative().optional(),
  originalPrice: z.number().nonnegative().optional(),
  currency: z.string().min(1).max(10).optional(),

  rating: z.number().min(0).max(5).optional(),
  reviewsCount: z.number().int().min(0).optional(),

  featured: z.boolean().optional(),
  destaque: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
  available: z.boolean().optional(),
  active: z.boolean().optional(),

  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const updateProductOfferSchema = z.object({
  externalLink: z.string().url(),

  catalogProductId: z.string().regex(/^MLB\d+$/i),
  itemId: z.string().regex(/^MLB\d+$/i),
  sellerId: z.string().regex(/^\d+$/),
});

export class MercadoLivreController {
  authorize(_request: Request, response: Response) {
    return response.json({
      authorizationUrl: getMercadoLivreAuthorizationUrl(),
    });
  }

  async callback(request: Request, response: Response) {
    const query = z
      .object({
        code: z.string(),
        state: z.string(),
      })
      .parse(request.query);

    await connectMercadoLivre(query.code, query.state);

    return response.redirect(
      `${mercadoLivreConfig.webUrl}/?mercadoLivre=connected`,
    );
  }

  async products(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().optional(),
      })
      .parse(request.query);

    return response.json({
      products: await getMercadoLivreProducts(query.search),
    });
  }

  async analyzeProduct(request: Request, response: Response) {
    const body = z
      .object({
        externalLink: z.string().url(),
      })
      .parse(request.body);

    const result = await analyzeMercadoLivreExternalLink(body.externalLink);

    return response.json(result);
  }

  async importProduct(request: Request, response: Response) {
    const body = importProductSchema.parse(request.body);

    const input = {
      affiliateUrl: body.affiliateUrl,
      externalLink: body.externalLink,
      catalogProductId: body.catalogProductId,
      itemId: body.itemId,
      sellerId: body.sellerId,
      subcategoryId: body.subcategoryId,
      title: body.title,

      ...(body.description !== undefined
        ? { description: body.description }
        : {}),

      ...(body.shortDescription !== undefined
        ? { shortDescription: body.shortDescription }
        : {}),

      ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl } : {}),

      ...(body.images !== undefined
        ? {
            images: body.images.map((image) =>
              image.sortOrder !== undefined
                ? {
                    imageUrl: image.imageUrl,
                    sortOrder: image.sortOrder,
                  }
                : {
                    imageUrl: image.imageUrl,
                  },
            ),
          }
        : {}),

      ...(body.price !== undefined ? { price: body.price } : {}),

      ...(body.originalPrice !== undefined
        ? { originalPrice: body.originalPrice }
        : {}),

      ...(body.currency !== undefined ? { currency: body.currency } : {}),

      ...(body.rating !== undefined ? { rating: body.rating } : {}),

      ...(body.reviewsCount !== undefined
        ? { reviewsCount: body.reviewsCount }
        : {}),

      ...(body.featured !== undefined ? { featured: body.featured } : {}),

      ...(body.destaque !== undefined ? { destaque: body.destaque } : {}),

      ...(body.bestSeller !== undefined ? { bestSeller: body.bestSeller } : {}),

      ...(body.available !== undefined ? { available: body.available } : {}),

      ...(body.active !== undefined ? { active: body.active } : {}),

      ...(body.seoTitle !== undefined ? { seoTitle: body.seoTitle } : {}),

      ...(body.seoDescription !== undefined
        ? { seoDescription: body.seoDescription }
        : {}),
    };

    const product = await importMercadoLivreProduct(input);

    return response.status(201).json({
      message: "Produto do Mercado Livre importado com sucesso",
      product,
    });
  }

  async updateProductOffer(request: Request, response: Response) {
    const productId = z.string().uuid().parse(request.params.productId);

    const body = updateProductOfferSchema.parse(request.body);

    const product = await updateMercadoLivreProductOffer(productId, body);

    return response.status(200).json({
      message: "Oferta do Mercado Livre atualizada com sucesso",
      product,
    });
  }

  async sync(_request: Request, response: Response) {
    const result = await syncMercadoLivreProducts();

    return response.json({
      message: "Produtos do Mercado Livre sincronizados com sucesso",
      products: result.products,
    });
  }
}
```

## src\controllers\products-controller.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";
import { syncMercadoLivreProducts } from "@/services/mercado-livre-service";
import { productsService } from "@/services/products-service";
import { createSlug } from "@/utils/createSlug";

const productImageSchema = z.object({
  imageUrl: z.string().trim().url(),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});
const createProductSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),
  imageUrl: z.string().trim().url(),
  images: z.array(productImageSchema).optional(),
  price: z.coerce.number().nonnegative(),
  originalPrice: z.coerce.number().nonnegative().optional(),
  currency: z.string().trim().default("BRL"),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewsCount: z.coerce.number().int().nonnegative().default(0),
  affiliateUrl: z.string().trim().url(),
  subcategoryId: z.string().uuid("ID da subcategoria inválido"),
  marketplaceId: z.string().uuid("ID do marketplace inválido"),
  featured: z.coerce.boolean().default(false),
  destaque: z.coerce.boolean().default(false),
  bestSeller: z.coerce.boolean().default(false),
  available: z.coerce.boolean().default(true),
  active: z.coerce.boolean().default(true),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});
const updateProductSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),
  imageUrl: z.string().trim().url().optional(),
  images: z.array(productImageSchema).optional(),
  price: z.coerce.number().nonnegative().optional(),
  originalPrice: z.coerce.number().nonnegative().optional(),
  currency: z.string().trim().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewsCount: z.coerce.number().int().nonnegative().optional(),
  affiliateUrl: z.string().trim().url().optional(),
  subcategoryId: z.string().uuid().optional(),
  marketplaceId: z.string().uuid().optional(),
  featured: z.coerce.boolean().optional(),
  destaque: z.coerce.boolean().optional(),
  bestSeller: z.coerce.boolean().optional(),
  available: z.coerce.boolean().optional(),
  active: z.coerce.boolean().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});
const updateProductStatusSchema = z
  .object({
    active: z.coerce.boolean().optional(),
    available: z.coerce.boolean().optional(),
    featured: z.coerce.boolean().optional(),
    destaque: z.coerce.boolean().optional(),
    bestSeller: z.coerce.boolean().optional(),
  })
  .refine(
    (data) =>
      data.active !== undefined ||
      data.available !== undefined ||
      data.featured !== undefined ||
      data.destaque !== undefined ||
      data.bestSeller !== undefined,
    { message: "Informe pelo menos um status para atualizar." },
  );
const idSchema = z.object({ id: z.string().uuid() });
const slugSchema = z.object({ slug: z.string().trim().min(1) });
const productSortSchema = z.enum([
  "recent",
  "price_asc",
  "price_desc",
  "rating",
]);
type CreateProductData = z.infer<typeof createProductSchema>;
type UpdateProductData = z.infer<typeof updateProductSchema>;
type UpdateProductStatusData = z.infer<typeof updateProductStatusSchema>;
export class ProductsController {
  async index(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        category: z.string().trim().optional(),
        subcategoryId: z.string().uuid().optional(),
        marketplaceId: z.string().uuid().optional(),
        featured: z.coerce.boolean().optional(),
        destaque: z.coerce.boolean().optional(),
        bestSeller: z.coerce.boolean().optional(),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(24),
        sort: productSortSchema.default("recent"),
      })
      .parse(request.query);
    const result = await productsService.list(query);
    return response.json(result);
  }
  async indexAdmin(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        subcategoryId: z.string().uuid().optional(),
        marketplaceId: z.string().uuid().optional(),
        featured: z.coerce.boolean().optional(),
        destaque: z.coerce.boolean().optional(),
        bestSeller: z.coerce.boolean().optional(),
        active: z.coerce.boolean().optional(),
        available: z.coerce.boolean().optional(),
      })
      .parse(request.query);
    const products = await productsService.listAdmin(query);
    return response.json({ products });
  }
  async create(request: Request, response: Response) {
    const data: CreateProductData = createProductSchema.parse(request.body);
    const slug = createSlug(data.title);
    const existingProduct = await productsService.findBySlug(slug);
    if (existingProduct) {
      return response
        .status(409)
        .json({ message: "Já existe um produto com esse título." });
    }
    const product = await productsService.create(data);
    return response.status(201).json({ product });
  }
  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const data: UpdateProductData = updateProductSchema.parse(request.body);
    const product = await productsService.findById(id);
    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }
    if (data.title && data.title !== product.title) {
      const slug = createSlug(data.title);
      const existingProduct = await productsService.findBySlugExceptId(
        slug,
        product.id,
      );
      if (existingProduct) {
        return response
          .status(409)
          .json({ message: "Já existe um produto com esse título." });
      }
    }
    const updatedProduct = await productsService.update(product.id, data);
    return response.json({ product: updatedProduct });
  }
  async updateStatus(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const data: UpdateProductStatusData = updateProductStatusSchema.parse(
      request.body,
    );
    const product = await productsService.findById(id);
    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }
    const updatedProduct = await productsService.updateStatus(product.id, data);
    return response.json({ product: updatedProduct });
  }
  async sync(request: Request, response: Response) {
    const expectedSecret = process.env.PRODUCT_SYNC_SECRET;
    const receivedSecret = request.header("x-sync-token");
    if (!expectedSecret || receivedSecret !== expectedSecret) {
      return response.status(401).json({ message: "Não autorizado" });
    }
    const result = await syncMercadoLivreProducts();
    return response.json({
      products: result.products,
      synced: result.products.length,
    });
  }
  async showById(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const product = await productsService.findById(id);
    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }
    return response.json({ product });
  }
  async show(request: Request, response: Response) {
    const { slug } = slugSchema.parse(request.params);
    const product = await productsService.findBySlug(slug);
    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }
    return response.json({ product });
  }
}
```

## src\controllers\search-controller.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";

import { searchService } from "@/services/search-service";

const searchSchema = z.object({
  q: z
    .string()
    .trim()
    .min(1, "Informe um termo para pesquisa.")
    .max(100, "O termo de pesquisa é muito longo."),
});

export class SearchController {
  async search(request: Request, response: Response) {
    const { q } = searchSchema.parse(request.query);

    const results = await searchService.search(q);

    return response.json({
      query: q,
      ...results,
    });
  }
}
```

## src\controllers\sessions-controllers.ts

```ts
import { compare } from "bcrypt";
import type { Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { authConfig } from "@/configs/auth";
import { prisma } from "@/database/prisma";
import { AppError } from "../utils/AppError";

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email({ message: "Email invalid" }),
      password: z.string(),
    });
    const { email, password } = bodySchema.parse(request.body);
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new AppError("Email or Password invalid!", 401);
    }
    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new AppError("Email or Password invalid!", 401);
    }
    const { secret } = authConfig.jwt;

    if (!secret) {
      throw new AppError("JWT_SECRET não configurado", 500);
    }

    const options: SignOptions = {
      subject: String(user.id),
      expiresIn: "1d",
    };

    const token = jwt.sign({ role: user.role }, secret, options);
    const { password: _, ...userWithoutPassword } = user;

    return response.json({ token, user: userWithoutPassword });
  }
}

export { SessionsController };
```

## src\controllers\subcategories-controller.ts

```ts
import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { subcategoriesService } from "../services/subcategories-services";
import { createSlug } from "../utils/createSlug";

export const subcategorySchema = z.object({
  categoryId: z.string().uuid(),
  name: z
    .string()
    .min(2, "O nome da subcategoria deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  image: z.string().url("Imagem deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const createSubcategorySchema = z.object({
  categoryId: z.string().uuid(),
  name: z
    .string()
    .min(2, "O nome da subcategoria deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  image: z.string().url("Imagem deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const updateSubcategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const idSchema = z.object({
  id: z.string().uuid(),
});

export class SubcategoriesController {
  async create(request: Request, response: Response) {
    const data = createSubcategorySchema.parse(request.body);

    const slug = createSlug(data.name);

    const existingSubcategory = await prisma.subcategory.findUnique({
      where: {
        categoryId_slug: {
          categoryId: data.categoryId,
          slug,
        },
      },
    });

    if (existingSubcategory) {
      return response.status(409).json({
        message: "Já existe uma subcategoria com esse nome.",
      });
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        slug,
        description: data.description ?? null,
        image: data.image ?? null,
        active: data.active,
        sortOrder: data.sortOrder,
      },
    });

    return response.status(201).json({
      subcategory,
    });
  }

  async list(req: Request, res: Response) {
    const subcategories = await subcategoriesService.list();

    return res.json(subcategories);
  }

  async get(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    const subcategory = await subcategoriesService.get(id);

    if (!subcategory) {
      return res.status(404).json({
        error: "Subcategoria não encontrada",
      });
    }

    return res.json(subcategory);
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const data = updateSubcategorySchema.parse(request.body);

    const subcategory = await prisma.subcategory.findUnique({
      where: {
        id,
      },
    });

    if (!subcategory) {
      return response.status(404).json({
        message: "Subcategoria não encontrada",
      });
    }

    let slug = subcategory.slug;

    if (data.name && data.name !== subcategory.name) {
      slug = createSlug(data.name);

      const existingSubcategory = await prisma.subcategory.findFirst({
        where: {
          slug,
          id: {
            not: subcategory.id,
          },
        },
      });

      if (existingSubcategory) {
        return response.status(409).json({
          message: "Já existe uma subcategoria com esse nome.",
        });
      }
    }

    const updatedSubcategory = await prisma.subcategory.update({
      where: {
        id: subcategory.id,
      },
      data: {
        ...(data.name !== undefined
          ? {
              name: data.name,
              slug,
            }
          : {}),
        ...(data.description !== undefined
          ? {
              description: data.description,
            }
          : {}),
        ...(data.image !== undefined
          ? {
              image: data.image,
            }
          : {}),
        ...(data.active !== undefined
          ? {
              active: data.active,
            }
          : {}),
        ...(data.sortOrder !== undefined
          ? {
              sortOrder: data.sortOrder,
            }
          : {}),
      },
    });

    return response.json({
      subcategory: updatedSubcategory,
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    await subcategoriesService.delete(id);

    return res.status(204).send();
  }
}
```

## src\controllers\users-controllers.ts

```ts
import { hash } from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import z from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class UserController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(3),
        email: z.email(),
        password: z.string().min(6),
      });

      const { name, email, password } = bodySchema.parse(request.body);

      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithSameEmail) {
        throw new AppError("Email already exists", 400);
      }

      const hashedPassword = await hash(password, 8);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      const { password: _, ...userWithoutPassword } = user;
      return response.json(userWithoutPassword);
    } catch (error) {
      console.log(error);
      next();
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    const users = await prisma.user.findMany();
    return response.json(users);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid({ message: "ID do usuário inválido." }),
      });

      const { id } = paramsSchema.parse(request.params);

      const bodySchema = z.object({
        name: z
          .string()
          .trim()
          .min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
          .optional(),
        email: z.string().email().optional(),
        password: z.string().min(6).optional(),
        role: z.enum(["ADMIN", "TECNICO", "CLIENTE"]).optional(),
      });

      const data = bodySchema.parse(request.body);
      const roleMap = {
        ADMIN: "admin",
        TECNICO: "sale",
        CLIENTE: "customer",
      } as const;

      const cleanData: {
        name?: string;
        email?: string;
        password?: string;
        role?: "customer" | "admin" | "sale";
      } = {};

      if (data.name !== undefined) cleanData.name = data.name;
      if (data.email !== undefined) cleanData.email = data.email;
      if (data.password !== undefined)
        cleanData.password = await hash(data.password, 8);
      if (data.role !== undefined) cleanData.role = roleMap[data.role];

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      if (Object.keys(cleanData).length === 0) {
        throw new AppError("Nenhum campo informado para atualização", 400);
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: cleanData,
      });

      const { password, ...userWithoutPassword } = updatedUser;

      return response.status(200).json(userWithoutPassword);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export { UserController };
```

## src\database\prisma.ts

```ts
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "../../env";
import { PrismaClient } from "../generated/prisma/client";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "production" ? [] : ["query"],
});
```

## src\middleware\ensure-admin.ts

```ts
import type { NextFunction, Request, Response } from "express";

import { AppError } from "@/utils/AppError";

export function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (request.user.role !== "admin") {
    throw new AppError("Acesso permitido somente para administradores", 403);
  }

  return next();
}
```

## src\middleware\ensure-authenticated.ts

```ts
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";

interface TokenPayload {
  sub: string;
  role: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token não informado", 401);
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    throw new AppError("Token inválido", 401);
  }

  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret) as TokenPayload;

    request.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    return next();
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }
}
```

## src\middleware\error-handling.ts

```ts
/*src/middleware/error-handling*/
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

export function errorHandling(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }
  if (error instanceof ZodError) {
    return response
      .status(400)
      .json({ message: "Validation error", issues: error });
  }
  return response.status(500).json({ message: error.message });
}
```

## src\routes\blog-categories-routes.ts

```ts
import { Router } from "express";

import { BlogCategoriesController } from "@/controllers/blog-categories-controller";
import { ensureAdmin } from "@/middleware/ensure-admin";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const blogCategoriesRoutes = Router();

const blogCategoriesController = new BlogCategoriesController();

// Públicas — leitura
blogCategoriesRoutes.get("/", blogCategoriesController.index);

blogCategoriesRoutes.get("/slug/:slug", blogCategoriesController.showBySlug);

// Administrativas — leitura por ID
blogCategoriesRoutes.get(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  blogCategoriesController.showById,
);

// Administrativas — criação
blogCategoriesRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  blogCategoriesController.create,
);

// Administrativas — atualização
blogCategoriesRoutes.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  blogCategoriesController.update,
);

// Administrativas — exclusão
blogCategoriesRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  blogCategoriesController.delete,
);

export { blogCategoriesRoutes };
```

## src\routes\blog-routes.ts

```ts
import { Router } from "express";

import { BlogController } from "@/controllers/blog-controller";

import { ensureAdmin } from "@/middleware/ensure-admin";

import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const blogRoutes = Router();

const blogController = new BlogController();

// Públicas

blogRoutes.get("/", blogController.index);

// Administrativas
// Devem ficar antes de /:slug para não serem interpretadas como slug.

blogRoutes.get(
  "/admin",
  ensureAuthenticated,
  ensureAdmin,
  blogController.indexAdmin,
);

blogRoutes.get(
  "/id/:id",
  ensureAuthenticated,
  ensureAdmin,
  blogController.showById,
);

blogRoutes.post("/", ensureAuthenticated, ensureAdmin, blogController.create);

blogRoutes.put("/:id", ensureAuthenticated, ensureAdmin, blogController.update);

blogRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  blogController.delete,
);

// Pública por slug
// Deve ficar depois das rotas administrativas específicas.

blogRoutes.get("/:slug", blogController.show);

export { blogRoutes };
```

## src\routes\categories-routes.ts

```ts
// src/routes/category-routes.ts
import { Router } from "express";

import { CategoryController } from "../controllers/categories-controllers";
import { ensureAdmin } from "../middleware/ensure-admin";
import { ensureAuthenticated } from "../middleware/ensure-authenticated";

const categoriesRouter = Router();

const categoryController = new CategoryController();

// Públicas/autenticadas para leitura
categoriesRouter.get("/", categoryController.list);
categoriesRouter.get("/:id", categoryController.get);

// Administrativas
categoriesRouter.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  categoryController.create,
);

categoriesRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  categoryController.update,
);

categoriesRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  categoryController.delete,
);

export { categoriesRouter as categoriesRoutes };
```

## src\routes\index.ts

```ts
/* src/routes/index.ts */

import { Router } from "express";
import { blogCategoriesRoutes } from "@/routes/blog-categories-routes";
import { searchRouter } from "@/routes/search-routes";
import { blogRoutes } from "./blog-routes";
import { categoriesRoutes } from "./categories-routes";
import { marketplaceRoutes } from "./marketplace-routes";
import { mercadoLivreRoutes } from "./mercado-livre-routes";
import { productRoutes } from "./product-routes";
import { sessionsRoutes } from "./sessions-routes";
import { subcategoriesRoutes } from "./subcategories-routes";
import { userRoutes } from "./user-routes";

const routes = Router();

routes.use("/users", userRoutes);

routes.use("/session", sessionsRoutes);

routes.use("/mercado-livre", mercadoLivreRoutes);

routes.use("/products", productRoutes);

routes.use("/categories", categoriesRoutes);

routes.use("/subcategories", subcategoriesRoutes);

routes.use("/marketplaces", marketplaceRoutes);

routes.use("/search", searchRouter);

routes.use("/blog/categories", blogCategoriesRoutes);

routes.use("/blog", blogRoutes);

export { routes };
```

## src\routes\marketplace-routes.ts

```ts
import { Router } from "express";

import { MarketplaceController } from "../controllers/marketplace-controller";
import { ensureAdmin } from "../middleware/ensure-admin";
import { ensureAuthenticated } from "../middleware/ensure-authenticated";

const marketplaceRouter = Router();

const marketplaceController = new MarketplaceController();

// Públicas para leitura
marketplaceRouter.get("/", marketplaceController.list);
marketplaceRouter.get("/:id", marketplaceController.get);

// Administrativas
marketplaceRouter.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  marketplaceController.create,
);

marketplaceRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  marketplaceController.update,
);

marketplaceRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  marketplaceController.delete,
);

export { marketplaceRouter as marketplaceRoutes };
```

## src\routes\mercado-livre-routes.ts

```ts
import { Router } from "express";

import { MercadoLivreController } from "@/controllers/mercado-livre-controller";
import { ensureAdmin } from "@/middleware/ensure-admin";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";
import { analyzeMercadoLivrePublicPage } from "@/services/mercado-livre/mercado-livre.service";
import { findCatalogOfferByItem } from "@/services/mercado-livre-service";

const mercadoLivreRoutes = Router();

const controller = new MercadoLivreController();

mercadoLivreRoutes.get("/authorize", controller.authorize.bind(controller));

mercadoLivreRoutes.get("/callback", controller.callback.bind(controller));

mercadoLivreRoutes.get("/products", controller.products.bind(controller));

mercadoLivreRoutes.get(
  "/products/check-offer",
  ensureAuthenticated,
  ensureAdmin,
  async (request, response) => {
    try {
      const { catalogProductId, sellerId, itemId } = request.query;

      if (
        typeof catalogProductId !== "string" ||
        typeof sellerId !== "string" ||
        typeof itemId !== "string"
      ) {
        return response.status(400).json({
          message:
            "Informe catalogProductId, sellerId e itemId como parâmetros da consulta.",
        });
      }

      const result = await findCatalogOfferByItem(
        catalogProductId,
        sellerId,
        itemId,
      );

      return response.status(200).json({
        catalogProductId,
        sellerId,
        itemId,
        ...result,
      });
    } catch (error) {
      console.error("Erro ao verificar oferta do Mercado Livre:", error);

      return response.status(500).json({
        message: "Erro ao verificar oferta do Mercado Livre.",
      });
    }
  },
);

mercadoLivreRoutes.post(
  "/products/analyze",
  ensureAuthenticated,
  ensureAdmin,
  controller.analyzeProduct.bind(controller),
);

mercadoLivreRoutes.post(
  "/products/import",
  ensureAuthenticated,
  ensureAdmin,
  controller.importProduct.bind(controller),
);

/*
 * Atualiza a oferta vinculada a um produto já existente.
 *
 * Importante:
 * - não cria Product;
 * - não cria MarketplaceProduct;
 * - mantém os mesmos IDs;
 * - atualiza apenas a referência/oferta do Mercado Livre.
 */
mercadoLivreRoutes.put(
  "/products/:productId/offer",
  ensureAuthenticated,
  ensureAdmin,
  controller.updateProductOffer.bind(controller),
);

mercadoLivreRoutes.post(
  "/products/analyze-page",
  ensureAuthenticated,
  ensureAdmin,
  async (request, response) => {
    try {
      const { url } = request.body;

      if (typeof url !== "string" || !url.trim()) {
        return response.status(400).json({
          message: "Informe a URL do produto do Mercado Livre.",
        });
      }

      const result = await analyzeMercadoLivrePublicPage(url);

      return response.status(200).json(result);
    } catch (error) {
      console.error("Erro ao analisar página pública do Mercado Livre:", error);

      return response.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao analisar página pública do Mercado Livre.",
      });
    }
  },
);

mercadoLivreRoutes.post(
  "/sync",
  ensureAuthenticated,
  ensureAdmin,
  controller.sync.bind(controller),
);

export { mercadoLivreRoutes };
```

## src\routes\product-routes.ts

```ts
import { Router } from "express";

import { ProductsController } from "@/controllers/products-controller";

import { ensureAdmin } from "@/middleware/ensure-admin";

import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const productRoutes = Router();

const productsController = new ProductsController();

// Públicas

productRoutes.get("/", productsController.index);

productRoutes.get(
  "/admin",
  ensureAuthenticated,
  ensureAdmin,
  productsController.indexAdmin,
);

productRoutes.get(
  "/id/:id",
  ensureAuthenticated,
  ensureAdmin,
  productsController.showById,
);

productRoutes.get("/:slug", productsController.show);

// Administrativas

productRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  productsController.create,
);

productRoutes.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  productsController.update,
);

productRoutes.patch(
  "/:id/status",
  ensureAuthenticated,
  ensureAdmin,
  productsController.updateStatus,
);

productRoutes.post(
  "/sync",
  ensureAuthenticated,
  ensureAdmin,
  productsController.sync,
);

export { productRoutes };
```

## src\routes\search-routes.ts

```ts
import { Router } from "express";

import { SearchController } from "@/controllers/search-controller";

const searchRouter = Router();

const searchController = new SearchController();

searchRouter.get("/", searchController.search);

export { searchRouter };
```

## src\routes\sessions-routes.ts

```ts
import { Router } from "express";
import { SessionsController } from "@/controllers/sessions-controllers";

const sessionsRoutes = Router();
const sessionsController = new SessionsController();

sessionsRoutes.post("/", sessionsController.create);

export { sessionsRoutes };
```

## src\routes\subcategories-routes.ts

```ts
import { Router } from "express";

import { SubcategoriesController } from "../controllers/subcategories-controller";
import { ensureAdmin } from "../middleware/ensure-admin";
import { ensureAuthenticated } from "../middleware/ensure-authenticated";

const subcategoriesRouter = Router();

const subcategoriesController = new SubcategoriesController();

// Públicas para leitura
subcategoriesRouter.get("/", subcategoriesController.list);
subcategoriesRouter.get("/:id", subcategoriesController.get);

// Administrativas
subcategoriesRouter.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  subcategoriesController.create,
);

subcategoriesRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  subcategoriesController.update,
);

subcategoriesRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  subcategoriesController.delete,
);

export { subcategoriesRouter as subcategoriesRoutes };
```

## src\routes\user-routes.ts

```ts
import { Router } from "express";

import { UserController } from "@/controllers/users-controllers";
import { ensureAdmin } from "@/middleware/ensure-admin";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const userRoutes = Router();

const userController = new UserController();

// Cadastro público
userRoutes.post("/", userController.create);

// Somente administrador
userRoutes.get("/", ensureAuthenticated, ensureAdmin, userController.index);

userRoutes.patch(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  userController.update,
);

userRoutes.put("/:id", ensureAuthenticated, ensureAdmin, userController.update);

export { userRoutes };
```

## src\server.ts

```ts
import { app } from "@/app";

const PORT = Number(process.env.PORT ?? 3333);

app.listen(PORT, () => {
  console.log(`WorldMix360 API rodando na porta: ${PORT}`);
});
```

## src\services\blog-categories-service.ts

```ts
import { prisma } from "@/database/prisma";

interface ListBlogCategoriesParams {
  search?: string;
  active?: boolean;
}

interface CreateBlogCategoryData {
  name: string;
  description?: string;
  image?: string;
  active?: boolean;
  sortOrder?: number;
}

interface UpdateBlogCategoryData {
  name?: string;
  description?: string;
  image?: string;
  active?: boolean;
  sortOrder?: number;
  slug?: string;
}

function normalizeSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function serializeBlogCategory(category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date | null;
  _count?: {
    posts: number;
  };
}) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    active: category.active,
    sortOrder: category.sortOrder,
    postsCount: category._count?.posts ?? 0,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

const blogCategoryInclude = {
  _count: {
    select: {
      posts: true,
    },
  },
};

export const blogCategoriesService = {
  async list(params: ListBlogCategoriesParams = {}) {
    const where = {
      ...(params.search
        ? {
            OR: [
              {
                name: {
                  contains: params.search,
                  mode: "insensitive" as const,
                },
              },
              {
                description: {
                  contains: params.search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
      ...(params.active !== undefined
        ? {
            active: params.active,
          }
        : {}),
    };

    const categories = await prisma.blogCategory.findMany({
      where,
      include: blogCategoryInclude,
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    return categories.map(serializeBlogCategory);
  },

  async findById(id: string) {
    const category = await prisma.blogCategory.findUnique({
      where: {
        id,
      },
      include: blogCategoryInclude,
    });

    if (!category) {
      return null;
    }

    return serializeBlogCategory(category);
  },

  async findBySlug(slug: string) {
    const category = await prisma.blogCategory.findUnique({
      where: {
        slug,
      },
      include: blogCategoryInclude,
    });

    if (!category) {
      return null;
    }

    return serializeBlogCategory(category);
  },

  async findBySlugExceptId(slug: string, id: string) {
    const category = await prisma.blogCategory.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
      include: blogCategoryInclude,
    });

    if (!category) {
      return null;
    }

    return serializeBlogCategory(category);
  },

  async create(data: CreateBlogCategoryData) {
    const slug = normalizeSlug(data.name);

    const category = await prisma.blogCategory.create({
      data: {
        name: data.name,
        slug,
        ...(data.description !== undefined
          ? {
              description: data.description,
            }
          : {}),
        ...(data.image !== undefined
          ? {
              image: data.image,
            }
          : {}),
        ...(data.active !== undefined
          ? {
              active: data.active,
            }
          : {}),
        ...(data.sortOrder !== undefined
          ? {
              sortOrder: data.sortOrder,
            }
          : {}),
      },
      include: blogCategoryInclude,
    });

    return serializeBlogCategory(category);
  },

  async update(id: string, data: UpdateBlogCategoryData) {
    const category = await prisma.blogCategory.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined
          ? {
              name: data.name,
            }
          : {}),
        ...(data.slug !== undefined
          ? {
              slug: data.slug,
            }
          : {}),
        ...(data.description !== undefined
          ? {
              description: data.description,
            }
          : {}),
        ...(data.image !== undefined
          ? {
              image: data.image,
            }
          : {}),
        ...(data.active !== undefined
          ? {
              active: data.active,
            }
          : {}),
        ...(data.sortOrder !== undefined
          ? {
              sortOrder: data.sortOrder,
            }
          : {}),
      },
      include: blogCategoryInclude,
    });

    return serializeBlogCategory(category);
  },

  async delete(id: string) {
    await prisma.blogCategory.delete({
      where: {
        id,
      },
    });
  },
};
```

## src\services\blog-service.ts

```ts
import { prisma } from "@/database/prisma";
import { BlogPostStatus } from "@/generated/prisma/client";

interface BlogPostProductInput {
  productId: string;
  sortOrder?: number;
}

interface CreateBlogPostInput {
  title: string;
  content: string;
  authorId: string;
  excerpt?: string;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: BlogPostStatus;
  publishedAt?: Date;
  scheduledAt?: Date;
  categoryId?: string;
  products?: BlogPostProductInput[];
}

interface UpdateBlogPostInput {
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: BlogPostStatus;
  publishedAt?: Date;
  scheduledAt?: Date;
  categoryId?: string;
  products?: BlogPostProductInput[];
}

interface ListBlogPostsInput {
  search?: string;
  categoryId?: string;
}

interface ListAdminBlogPostsInput {
  search?: string;
  categoryId?: string;
  status?: BlogPostStatus;
}

const blogPostInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },

  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },

  products: {
    orderBy: {
      sortOrder: "asc" as const,
    },

    select: {
      id: true,
      sortOrder: true,

      product: {
        select: {
          id: true,
          title: true,
          slug: true,
          shortDescription: true,
          imageUrl: true,
          price: true,
          originalPrice: true,
          currency: true,
          rating: true,
          reviewsCount: true,
          affiliateUrl: true,
          available: true,
          featured: true,
          active: true,
        },
      },
    },
  },
};

function serializeBlogPost(post: any) {
  return {
    ...post,

    products: post.products.map((item: any) => ({
      id: item.id,
      sortOrder: item.sortOrder,
      product: item.product,
    })),
  };
}

function serializeBlogPosts(posts: any[]) {
  return posts.map(serializeBlogPost);
}

function createBlogSlug(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const blogService = {
  async list(input: ListBlogPostsInput = {}) {
    const where: {
      status: BlogPostStatus;
      OR?: Array<{
        title?: {
          contains: string;
          mode: "insensitive";
        };
        excerpt?: {
          contains: string;
          mode: "insensitive";
        };
        content?: {
          contains: string;
          mode: "insensitive";
        };
      }>;
      categoryId?: string;
    } = {
      status: BlogPostStatus.PUBLISHED,
    };

    if (input.search !== undefined) {
      where.OR = [
        {
          title: {
            contains: input.search,
            mode: "insensitive",
          },
        },
        {
          excerpt: {
            contains: input.search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: input.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (input.categoryId !== undefined) {
      where.categoryId = input.categoryId;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: blogPostInclude,
      orderBy: {
        publishedAt: "desc",
      },
    });

    return serializeBlogPosts(posts);
  },

  async listAdmin(input: ListAdminBlogPostsInput = {}) {
    const where: {
      OR?: Array<{
        title?: {
          contains: string;
          mode: "insensitive";
        };
        excerpt?: {
          contains: string;
          mode: "insensitive";
        };
        content?: {
          contains: string;
          mode: "insensitive";
        };
      }>;
      categoryId?: string;
      status?: BlogPostStatus;
    } = {};

    if (input.search !== undefined) {
      where.OR = [
        {
          title: {
            contains: input.search,
            mode: "insensitive",
          },
        },
        {
          excerpt: {
            contains: input.search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: input.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (input.categoryId !== undefined) {
      where.categoryId = input.categoryId;
    }

    if (input.status !== undefined) {
      where.status = input.status;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: blogPostInclude,
      orderBy: {
        createdAt: "desc",
      },
    });

    return serializeBlogPosts(posts);
  },

  async findById(id: string) {
    const post = await prisma.blogPost.findUnique({
      where: {
        id,
      },
      include: blogPostInclude,
    });

    if (!post) {
      return null;
    }

    return serializeBlogPost(post);
  },

  async findBySlug(slug: string) {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
      },
      include: blogPostInclude,
    });

    if (!post) {
      return null;
    }

    return serializeBlogPost(post);
  },

  async findBySlugExceptId(slug: string, id: string) {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
      include: blogPostInclude,
    });

    if (!post) {
      return null;
    }

    return serializeBlogPost(post);
  },

  async create(data: CreateBlogPostInput) {
    const postData = {
      title: data.title,
      slug: createBlogSlug(data.title),
      content: data.content,

      author: {
        connect: {
          id: data.authorId,
        },
      },

      ...(data.excerpt !== undefined
        ? {
            excerpt: data.excerpt,
          }
        : {}),

      ...(data.coverImage !== undefined
        ? {
            coverImage: data.coverImage,
          }
        : {}),

      ...(data.seoTitle !== undefined
        ? {
            seoTitle: data.seoTitle,
          }
        : {}),

      ...(data.seoDescription !== undefined
        ? {
            seoDescription: data.seoDescription,
          }
        : {}),

      ...(data.status !== undefined
        ? {
            status: data.status,
          }
        : {}),

      ...(data.publishedAt !== undefined
        ? {
            publishedAt: data.publishedAt,
          }
        : {}),

      ...(data.scheduledAt !== undefined
        ? {
            scheduledAt: data.scheduledAt,
          }
        : {}),

      ...(data.categoryId !== undefined
        ? {
            category: {
              connect: {
                id: data.categoryId,
              },
            },
          }
        : {}),

      ...(data.products !== undefined && data.products.length > 0
        ? {
            products: {
              create: data.products.map((product) => ({
                sortOrder: product.sortOrder ?? 0,

                product: {
                  connect: {
                    id: product.productId,
                  },
                },
              })),
            },
          }
        : {}),
    };

    const post = await prisma.blogPost.create({
      data: postData,
      include: blogPostInclude,
    });

    return serializeBlogPost(post);
  },

  async update(id: string, data: UpdateBlogPostInput) {
    const postData = {
      ...(data.title !== undefined
        ? {
            title: data.title,
            slug: createBlogSlug(data.title),
          }
        : {}),

      ...(data.excerpt !== undefined
        ? {
            excerpt: data.excerpt,
          }
        : {}),

      ...(data.content !== undefined
        ? {
            content: data.content,
          }
        : {}),

      ...(data.coverImage !== undefined
        ? {
            coverImage: data.coverImage,
          }
        : {}),

      ...(data.seoTitle !== undefined
        ? {
            seoTitle: data.seoTitle,
          }
        : {}),

      ...(data.seoDescription !== undefined
        ? {
            seoDescription: data.seoDescription,
          }
        : {}),

      ...(data.status !== undefined
        ? {
            status: data.status,
          }
        : {}),

      ...(data.publishedAt !== undefined
        ? {
            publishedAt: data.publishedAt,
          }
        : {}),

      ...(data.scheduledAt !== undefined
        ? {
            scheduledAt: data.scheduledAt,
          }
        : {}),
    };

    const post = await prisma.$transaction(async (transaction) => {
      if (data.products !== undefined) {
        await transaction.blogPostProduct.deleteMany({
          where: {
            postId: id,
          },
        });
      }

      const updatedPost = await transaction.blogPost.update({
        where: {
          id,
        },

        data: {
          ...postData,

          ...(data.categoryId !== undefined
            ? {
                category: {
                  connect: {
                    id: data.categoryId,
                  },
                },
              }
            : {}),

          ...(data.products !== undefined
            ? {
                products: {
                  create: data.products.map((product) => ({
                    sortOrder: product.sortOrder ?? 0,

                    product: {
                      connect: {
                        id: product.productId,
                      },
                    },
                  })),
                },
              }
            : {}),
        },

        include: blogPostInclude,
      });

      return updatedPost;
    });

    return serializeBlogPost(post);
  },

  async delete(id: string) {
    await prisma.blogPost.delete({
      where: {
        id,
      },
    });
  },
};
```

## src\services\categories-service.ts

```ts
import { prisma } from "@/database/prisma";

export const categoryService = {
  async create(data: any) {
    return prisma.category.create({
      data,
    });
  },

  async list() {
    return prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });
  },

  async get(id: string) {
    return prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        subcategories: true,
      },
    });
  },

  async update(id: string, data: any) {
    return prisma.category.update({
      where: {
        id,
      },
      data,
    });
  },

  async delete(id: string) {
    return prisma.category.delete({
      where: {
        id,
      },
    });
  },
};
```

## src\services\marketplace-service.ts

```ts
import { prisma } from "@/database/prisma";

export const marketplaceService = {
  async create(data: any) {
    return prisma.marketplace.create({
      data,
    });
  },

  async list() {
    return prisma.marketplace.findMany({
      include: {
        products: true,
      },
    });
  },

  async get(id: string) {
    return prisma.marketplace.findUnique({
      where: {
        id,
      },
      include: {
        products: true,
      },
    });
  },

  async update(id: string, data: any) {
    return prisma.marketplace.update({
      where: {
        id,
      },
      data,
    });
  },

  async delete(id: string) {
    return prisma.marketplace.delete({
      where: {
        id,
      },
    });
  },
};
```

## src\services\mercado-livre\mercado-livre.api.ts

```ts
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
```

## src\services\mercado-livre\mercado-livre.auth.ts

```ts
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
```

## src\services\mercado-livre\mercado-livre.helpers.ts

```ts
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
```

## src\services\mercado-livre\mercado-livre.service.ts

```ts
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

    featured: input.featured ?? false,

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
```

## src\services\mercado-livre\mercado-livre.types.ts

```ts
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
```

## src\services\mercado-livre-service.ts

```ts
export {
  analyzeMercadoLivreExternalLink,
  connectMercadoLivre,
  findCatalogOfferByItem,
  getMercadoLivreAuthorizationUrl,
  getMercadoLivreProducts,
  importMercadoLivreProduct,
  recoverLegacyProduct,
  syncMercadoLivreProducts,
  updateMercadoLivreProductOffer,
} from "./mercado-livre/mercado-livre.service";

export type {
  ImportImageInput,
  ImportInput,
  UpdateMercadoLivreProductOfferInput,
} from "./mercado-livre/mercado-livre.types";
```

## src\services\products-service.ts

```ts
import { prisma } from "@/database/prisma";

type ProductImageInput = {
  imageUrl: string;
  sortOrder?: number | undefined;
};

type CreateProductInput = {
  title: string;
  description?: string | undefined;
  shortDescription?: string | undefined;
  imageUrl: string;
  images?: ProductImageInput[] | undefined;
  price: number;
  originalPrice?: number | undefined;
  currency: string;
  rating?: number | undefined;
  reviewsCount?: number | undefined;
  affiliateUrl: string;
  subcategoryId: string;
  marketplaceId: string;
  featured?: boolean | undefined;
  destaque?: boolean | undefined;
  bestSeller?: boolean | undefined;
  available?: boolean | undefined;
  active?: boolean | undefined;
  seoTitle?: string | undefined;
  seoDescription?: string | undefined;
};

type UpdateProductInput = {
  title?: string | undefined;
  description?: string | undefined;
  shortDescription?: string | undefined;
  imageUrl?: string | undefined;
  images?: ProductImageInput[] | undefined;
  price?: number | undefined;
  originalPrice?: number | undefined;
  currency?: string | undefined;
  rating?: number | undefined;
  reviewsCount?: number | undefined;
  affiliateUrl?: string | undefined;
  subcategoryId?: string | undefined;
  marketplaceId?: string | undefined;
  featured?: boolean | undefined;
  destaque?: boolean | undefined;
  bestSeller?: boolean | undefined;
  available?: boolean | undefined;
  active?: boolean | undefined;
  seoTitle?: string | undefined;
  seoDescription?: string | undefined;
};

type ProductStatusInput = {
  active?: boolean | undefined;
  available?: boolean | undefined;
  featured?: boolean | undefined;
  destaque?: boolean | undefined;
  bestSeller?: boolean | undefined;
};

type ProductSort = "recent" | "price_asc" | "price_desc" | "rating";

type ProductQuery = {
  search?: string | undefined;
  category?: string | undefined;
  subcategoryId?: string | undefined;
  marketplaceId?: string | undefined;
  featured?: boolean | undefined;
  destaque?: boolean | undefined;
  bestSeller?: boolean | undefined;
  page?: number | undefined;
  limit?: number | undefined;
  sort?: ProductSort | undefined;
};

type ProductAdminQuery = {
  search?: string | undefined;
  subcategoryId?: string | undefined;
  marketplaceId?: string | undefined;
  featured?: boolean | undefined;
  destaque?: boolean | undefined;
  bestSeller?: boolean | undefined;
  active?: boolean | undefined;
  available?: boolean | undefined;
};

type ProductWithRelations = {
  subcategory?: {
    name?: string;
    slug?: string;
    category?: {
      id?: string;
      name: string;
      slug?: string;
    } | null;
  } | null;

  images?: Array<{
    id: string;
    imageUrl: string;
    sortOrder: number;
  }>;

  marketplaceProducts?: Array<{
    id: string;
    productId: string;
    marketplaceId: string;
    externalId: string;
    catalogProductId: string | null;
    itemId: string | null;
    sellerId: string | null;
    externalLink: string | null;
    affiliateUrl: string;
    price: unknown;
    originalPrice: unknown;
    currency: string;
    rating: unknown;
    reviewsCount: number;
    available: boolean;
    syncStatus: string;
    lastSyncedAt: Date | null;
    lastSyncError: string | null;
  }>;

  [key: string]: unknown;
};

function serializeProduct<T extends ProductWithRelations>(product: T) {
  const { subcategory, ...productData } = product;

  return {
    ...productData,
    category: subcategory?.category?.name ?? null,
  };
}

function serializeProducts<T extends ProductWithRelations>(products: T[]) {
  return products.map(serializeProduct);
}

export const productsService = {
  async list(query: ProductQuery = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 24;
    const skip = (page - 1) * limit;
    const sort = query.sort ?? "recent";

    const where = {
      active: true,
      available: true,

      ...(query.search
        ? {
            OR: [
              {
                title: {
                  contains: query.search,
                  mode: "insensitive" as const,
                },
              },
              {
                description: {
                  contains: query.search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),

      ...(query.category
        ? {
            subcategory: {
              category: {
                OR: [
                  {
                    slug: {
                      equals: query.category,
                      mode: "insensitive" as const,
                    },
                  },
                  {
                    name: {
                      equals: query.category,
                      mode: "insensitive" as const,
                    },
                  },
                ],
              },
            },
          }
        : {}),

      ...(query.subcategoryId
        ? {
            subcategoryId: query.subcategoryId,
          }
        : {}),

      ...(query.marketplaceId
        ? {
            marketplaceId: query.marketplaceId,
          }
        : {}),

      ...(query.featured !== undefined
        ? {
            featured: query.featured,
          }
        : {}),

      ...(query.destaque !== undefined
        ? {
            destaque: query.destaque,
          }
        : {}),

      ...(query.bestSeller !== undefined
        ? {
            bestSeller: query.bestSeller,
          }
        : {}),
    };

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" as const }
        : sort === "price_desc"
          ? { price: "desc" as const }
          : sort === "rating"
            ? { rating: "desc" as const }
            : { createdAt: "desc" as const };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,

        include: {
          subcategory: {
            include: {
              category: true,
            },
          },

          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },

        orderBy,

        skip,
        take: limit,
      }),

      prisma.product.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      products: serializeProducts(products),

      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  async listAdmin(query: ProductAdminQuery = {}) {
    const products = await prisma.product.findMany({
      where: {
        ...(query.search
          ? {
              OR: [
                {
                  title: {
                    contains: query.search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: query.search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),

        ...(query.subcategoryId
          ? {
              subcategoryId: query.subcategoryId,
            }
          : {}),

        ...(query.marketplaceId
          ? {
              marketplaceId: query.marketplaceId,
            }
          : {}),

        ...(query.featured !== undefined
          ? {
              featured: query.featured,
            }
          : {}),

        ...(query.destaque !== undefined
          ? {
              destaque: query.destaque,
            }
          : {}),

        ...(query.bestSeller !== undefined
          ? {
              bestSeller: query.bestSeller,
            }
          : {}),

        ...(query.active !== undefined
          ? {
              active: query.active,
            }
          : {}),

        ...(query.available !== undefined
          ? {
              available: query.available,
            }
          : {}),
      },

      include: {
        subcategory: {
          include: {
            category: true,
          },
        },

        marketplace: true,

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return serializeProducts(products);
  },

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        subcategory: {
          include: {
            category: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },

        marketplaceProducts: true,
      },
    });

    if (!product) {
      return null;
    }

    return serializeProduct(product);
  },

  async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },

      include: {
        subcategory: {
          include: {
            category: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return serializeProduct(product);
  },

  async findBySlugExceptId(slug: string, id: string) {
    return prisma.product.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
    });
  },

  async create(data: CreateProductInput) {
    const slug = createProductSlug(data.title);

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug,

        ...(data.description !== undefined
          ? {
              description: data.description,
            }
          : {}),

        ...(data.shortDescription !== undefined
          ? {
              shortDescription: data.shortDescription,
            }
          : {}),

        imageUrl: data.imageUrl,

        price: data.price,

        ...(data.originalPrice !== undefined
          ? {
              originalPrice: data.originalPrice,
            }
          : {}),

        currency: data.currency,

        ...(data.rating !== undefined
          ? {
              rating: data.rating,
            }
          : {}),

        reviewsCount: data.reviewsCount ?? 0,

        affiliateUrl: data.affiliateUrl,

        available: data.available ?? true,
        featured: data.featured ?? false,
        destaque: data.destaque ?? false,
        bestSeller: data.bestSeller ?? false,
        active: data.active ?? true,

        ...(data.seoTitle !== undefined
          ? {
              seoTitle: data.seoTitle,
            }
          : {}),

        ...(data.seoDescription !== undefined
          ? {
              seoDescription: data.seoDescription,
            }
          : {}),

        subcategory: {
          connect: {
            id: data.subcategoryId,
          },
        },

        marketplace: {
          connect: {
            id: data.marketplaceId,
          },
        },

        ...(data.images !== undefined
          ? {
              images: {
                create: data.images.map((image, index) => ({
                  imageUrl: image.imageUrl,
                  sortOrder: image.sortOrder ?? index,
                })),
              },
            }
          : {}),
      },

      include: {
        subcategory: {
          include: {
            category: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return serializeProduct(product);
  },

  async update(id: string, data: UpdateProductInput) {
    const product = await prisma.$transaction(async (tx) => {
      if (data.images !== undefined) {
        await tx.productImage.deleteMany({
          where: {
            productId: id,
          },
        });
      }

      const updatedProduct = await tx.product.update({
        where: {
          id,
        },

        data: {
          ...(data.title !== undefined
            ? {
                title: data.title,
                slug: createProductSlug(data.title),
              }
            : {}),

          ...(data.description !== undefined
            ? {
                description: data.description,
              }
            : {}),

          ...(data.shortDescription !== undefined
            ? {
                shortDescription: data.shortDescription,
              }
            : {}),

          ...(data.imageUrl !== undefined
            ? {
                imageUrl: data.imageUrl,
              }
            : {}),

          ...(data.price !== undefined
            ? {
                price: data.price,
              }
            : {}),

          ...(data.originalPrice !== undefined
            ? {
                originalPrice: data.originalPrice,
              }
            : {}),

          ...(data.currency !== undefined
            ? {
                currency: data.currency,
              }
            : {}),

          ...(data.rating !== undefined
            ? {
                rating: data.rating,
              }
            : {}),

          ...(data.reviewsCount !== undefined
            ? {
                reviewsCount: data.reviewsCount,
              }
            : {}),

          ...(data.affiliateUrl !== undefined
            ? {
                affiliateUrl: data.affiliateUrl,
              }
            : {}),

          ...(data.available !== undefined
            ? {
                available: data.available,
              }
            : {}),

          ...(data.featured !== undefined
            ? {
                featured: data.featured,
              }
            : {}),

          ...(data.destaque !== undefined
            ? {
                destaque: data.destaque,
              }
            : {}),

          ...(data.bestSeller !== undefined
            ? {
                bestSeller: data.bestSeller,
              }
            : {}),

          ...(data.active !== undefined
            ? {
                active: data.active,
              }
            : {}),

          ...(data.seoTitle !== undefined
            ? {
                seoTitle: data.seoTitle,
              }
            : {}),

          ...(data.seoDescription !== undefined
            ? {
                seoDescription: data.seoDescription,
              }
            : {}),

          ...(data.subcategoryId !== undefined
            ? {
                subcategory: {
                  connect: {
                    id: data.subcategoryId,
                  },
                },
              }
            : {}),

          ...(data.marketplaceId !== undefined
            ? {
                marketplace: {
                  connect: {
                    id: data.marketplaceId,
                  },
                },
              }
            : {}),

          ...(data.images !== undefined
            ? {
                images: {
                  create: data.images.map((image, index) => ({
                    imageUrl: image.imageUrl,
                    sortOrder: image.sortOrder ?? index,
                  })),
                },
              }
            : {}),
        },

        include: {
          subcategory: {
            include: {
              category: true,
            },
          },

          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });

      return updatedProduct;
    });

    return serializeProduct(product);
  },

  async updateStatus(id: string, data: ProductStatusInput) {
    const product = await prisma.product.update({
      where: {
        id,
      },

      data: {
        ...(data.active !== undefined
          ? {
              active: data.active,
            }
          : {}),

        ...(data.available !== undefined
          ? {
              available: data.available,
            }
          : {}),

        ...(data.featured !== undefined
          ? {
              featured: data.featured,
            }
          : {}),

        ...(data.destaque !== undefined
          ? {
              destaque: data.destaque,
            }
          : {}),

        ...(data.bestSeller !== undefined
          ? {
              bestSeller: data.bestSeller,
            }
          : {}),
      },

      include: {
        subcategory: {
          include: {
            category: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return serializeProduct(product);
  },
};

function createProductSlug(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

## src\services\search-service.ts

```ts
import { prisma } from "@/database/prisma";

export const searchService = {
  async search(query: string) {
    const search = query.trim();

    if (!search) {
      return {
        products: [],
        categories: [],
        subcategories: [],
      };
    }

    const [products, categories, subcategories] = await Promise.all([
      prisma.product.findMany({
        where: {
          active: true,
          available: true,
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              shortDescription: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              subcategory: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              subcategory: {
                category: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        },
        include: {
          subcategory: {
            include: {
              category: true,
            },
          },
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      }),

      prisma.category.findMany({
        where: {
          active: true,
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          sortOrder: "asc",
        },
        take: 20,
      }),

      prisma.subcategory.findMany({
        where: {
          active: true,
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          category: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
        take: 20,
      }),
    ]);

    return {
      products: products.map((product) => {
        const { subcategory, ...productData } = product;

        return {
          ...productData,
          category: subcategory?.category?.name ?? null,
        };
      }),

      categories,

      subcategories,
    };
  },
};
```

## src\services\subcategories-services.ts

```ts
import { prisma } from "@/database/prisma";

export const subcategoriesService = {
  async create(data: any) {
    return prisma.subcategory.create({
      data,
    });
  },

  async list() {
    return prisma.subcategory.findMany({
      include: {
        category: true,
        products: true,
      },
    });
  },

  async get(id: string) {
    return prisma.subcategory.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        products: true,
      },
    });
  },

  async update(id: string, data: any) {
    return prisma.subcategory.update({
      where: {
        id,
      },
      data,
    });
  },

  async delete(id: string) {
    return prisma.subcategory.delete({
      where: {
        id,
      },
    });
  },
};
```

## src\types\aliases.d.ts

```ts
declare module "@/*";
```

## src\types\express\index.d.ts

```ts
declare namespace Express {
  export interface Request {
    user: {
      id: string;
      role: string;
    };
  }
}
```

## src\utils\AppError.ts

```ts
class AppError {
  message: string;
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export { AppError };
```

## src\utils\createSlug.ts

```ts
export function createSlug(value: string, suffix?: string) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!suffix) {
    return slug;
  }

  return `${slug}-${suffix}`;
}
```

## tools\generate-md.ts

```ts
import {
  readdirSync,
  statSync,
  readFileSync,
  appendFileSync,
  existsSync,
  unlinkSync,
} from "fs";
import { join, extname, dirname, resolve, relative, basename } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// raiz do projeto (um nível acima de tools)
const projectPath = resolve(__dirname, "..");

// pega o nome da pasta raiz (nome do projeto)
const projectName = basename(projectPath);

// gera o arquivo dentro de tools com o nome do projeto
const outputFile = join(__dirname, `${projectName}.md`);

const extensions = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".env",
  ".css",
];
const specialFiles = [
  "Dockerfile",
  "Makefile",
  ".eslintrc",
  ".prettierrc",
  "vite.config.ts",
  "vite.config.js",
  "tailwind.config.js",
  "postcss.config.js",
];
const excludeDirs = ["node_modules", ".git", "dist", "build", "generated"];
const excludeFiles = ["package-lock.json"];

if (existsSync(outputFile)) unlinkSync(outputFile);

function formatHeader(fullPath: string): string {
  const rel = relative(projectPath, fullPath);
  return `## ${rel}`;
}

function wrapContent(ext: string, content: string): string {
  if ([".ts", ".tsx", ".js"].includes(ext))
    return `\n\`\`\`${ext.replace(".", "")}\n${content}\n\`\`\`\n`;
  if (ext === ".json") return `\n\`\`\`json\n${content}\n\`\`\`\n`;
  if (ext === ".md") return `\n${content}\n`;
  if (ext === ".env") return `\n\`\`\`env\n${content}\n\`\`\`\n`;
  if (specialFiles.includes(ext)) return `\n\`\`\`\n${content}\n\`\`\`\n`;
  return `\n${content}\n`;
}

function walk(dir: string): void {
  for (const file of readdirSync(dir)) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) walk(fullPath);
    } else {
      const ext = extname(file) || file;
      if (
        (extensions.includes(ext) || specialFiles.includes(file)) &&
        !excludeFiles.includes(file)
      ) {
        try {
          const content = readFileSync(fullPath, "utf8");
          appendFileSync(outputFile, `\n${formatHeader(fullPath)}\n`);
          appendFileSync(outputFile, wrapContent(ext, content));
        } catch (err) {
          console.error(
            "⚠️ Erro ao ler arquivo:",
            fullPath,
            (err as Error).message,
          );
        }
      }
    }
  }
}

console.log(`🔍 Gerando arquivo ${projectName}.md...`);
walk(projectPath);
console.log(`✅ Arquivo gerado com sucesso em ${outputFile}`);
```

## tools\instrucoes.md

📘 Guia de Uso — Script `generate-md.ts`

Este utilitário percorre todo o projeto (backend ou frontend) e gera um arquivo `.md` com o conteúdo dos arquivos, formatado em Markdown e destacado por tipo de código.

---

## 🛠️ Estrutura do Projeto

```
meu-projeto/
├─ backend/
│   ├─ src/
│   └─ tools/
│       └─ generate-md.ts
├─ frontend/
│   ├─ src/
│   └─ tools/
│       └─ generate-md.ts
├─ package.json
└─ tsconfig.json
---
```

## 📂 Script `generate-md.ts`

Coloque este arquivo dentro da pasta `tools` de cada parte (backend e frontend):

```ts
import {
  readdirSync,
  statSync,
  readFileSync,
  appendFileSync,
  existsSync,
  unlinkSync,
} from "fs";
import { join, extname, dirname, resolve, relative, basename } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// raiz do projeto (um nível acima da pasta tools)
const projectPath = resolve(__dirname, "..");

// nome da pasta raiz (ex: backend ou frontend)
const projectName = basename(projectPath);

// arquivo de saída dentro da pasta tools
const outputFile = join(__dirname, `${projectName}.md`);

const extensions = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".env",
  ".css",
];
const specialFiles = [
  "Dockerfile",
  "Makefile",
  ".eslintrc",
  ".prettierrc",
  "vite.config.ts",
  "vite.config.js",
  "tailwind.config.js",
  "postcss.config.js",
];
const excludeDirs = ["node_modules", ".git", "dist", "build", "generated"];
const excludeFiles = ["package-lock.json"];

if (existsSync(outputFile)) unlinkSync(outputFile);

function formatHeader(fullPath: string): string {
  const rel = relative(projectPath, fullPath);
  return `## ${rel}`;
}

function wrapContent(ext: string, content: string): string {
  if ([".ts", ".tsx", ".js", ".jsx"].includes(ext))
    return `\n\`\`\`${ext.replace(".", "")}\n${content}\n\`\`\`\n`;
  if (ext === ".json") return `\n\`\`\`json\n${content}\n\`\`\`\n`;
  if (ext === ".md") return `\n${content}\n`;
  if (ext === ".env") return `\n\`\`\`env\n${content}\n\`\`\`\n`;
  if (ext === ".css") return `\n\`\`\`css\n${content}\n\`\`\`\n`;
  if (specialFiles.includes(ext)) return `\n\`\`\`\n${content}\n\`\`\`\n`;
  return `\n${content}\n`;
}

function walk(dir: string): void {
  for (const file of readdirSync(dir)) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) walk(fullPath);
    } else {
      const ext = extname(file) || file;
      if (
        (extensions.includes(ext) || specialFiles.includes(file)) &&
        !excludeFiles.includes(file)
      ) {
        try {
          const content = readFileSync(fullPath, "utf8");
          appendFileSync(outputFile, `\n${formatHeader(fullPath)}\n`);
          appendFileSync(outputFile, wrapContent(ext, content));
        } catch (err) {
          console.error(
            "⚠️ Erro ao ler arquivo:",
            fullPath,
            (err as Error).message,
          );
        }
      }
    }
  }
}

console.log(`🔍 Gerando arquivo ${projectName}.md...`);
walk(projectPath);
console.log(`✅ Arquivo gerado com sucesso em ${outputFile}`);
```

⚙️ Configuração do TypeScript

- No tsconfig.json da raiz, adicione:

```
{
  "compilerOptions": {
    "module": "ESNext",
    "target": "ES2020",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "types": ["node"]
  },
  "include": ["src", "tools"]
}
```

📦 Dependências

- Instale:

```
"scripts": {
  "generate-md": "tsx tools/generate-md.ts"
}

```

🚀 Como Rodar

- No terminal, vá até a pasta desejada e rode:

```
npm run generate-md
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2023",

    "rootDir": ".",
    "outDir": "./dist",
    "paths": {
      "@/*": ["./src/*"]
    },
    "strict": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "types": ["node", "express"],
    "ignoreDeprecations": "6.0"
  },
  "include": ["src", "src/types", "env.ts"],
  "exclude": ["node_modules", "dist"]
}
```
