# WORLD MIX 360 - API

## .env

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/world_mix360?schema=public"

JWT_SECRET=r0s3nd0

PRODUCT_SYNC_SECRET=3ee7524986e159cb3c02a833149821f25ede1614dc0944ded3451cd550c04550
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
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.23.0",
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
  connectMercadoLivre,
  getMercadoLivreAuthorizationUrl,
  getMercadoLivreProducts,
} from "@/services/mercado-livre-service";

export class MercadoLivreController {
  authorize(_request: Request, response: Response) {
    return response.json({
      authorizationUrl: getMercadoLivreAuthorizationUrl(),
    });
  }

  async callback(request: Request, response: Response) {
    const query = z
      .object({ code: z.string(), state: z.string() })
      .parse(request.query);
    await connectMercadoLivre(query.code, query.state);
    return response.redirect(
      `${mercadoLivreConfig.webUrl}/?mercadoLivre=connected`,
    );
  }

  async products(request: Request, response: Response) {
    const query = z
      .object({ search: z.string().optional() })
      .parse(request.query);
    return response.json({
      products: await getMercadoLivreProducts(query.search),
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
  })
  .refine(
    (data) =>
      data.active !== undefined ||
      data.available !== undefined ||
      data.featured !== undefined,
    {
      message: "Informe pelo menos um status para atualizar.",
    },
  );

const idSchema = z.object({
  id: z.string().uuid(),
});

const slugSchema = z.object({
  slug: z.string().trim().min(1),
});

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
      })
      .parse(request.query);

    const products = await productsService.list(query);

    return response.json({
      products,
    });
  }

  async indexAdmin(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        subcategoryId: z.string().uuid().optional(),
        marketplaceId: z.string().uuid().optional(),
        featured: z.coerce.boolean().optional(),
        active: z.coerce.boolean().optional(),
        available: z.coerce.boolean().optional(),
      })
      .parse(request.query);

    const products = await productsService.listAdmin(query);

    return response.json({
      products,
    });
  }

  async create(request: Request, response: Response) {
    const data: CreateProductData = createProductSchema.parse(request.body);
    const slug = createSlug(data.title);
    const existingProduct = await productsService.findBySlug(slug);

    if (existingProduct) {
      return response.status(409).json({
        message: "Já existe um produto com esse título.",
      });
    }

    const product = await productsService.create(data);

    return response.status(201).json({ product });
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const data: UpdateProductData = updateProductSchema.parse(request.body);
    const product = await productsService.findById(id);

    if (!product) {
      return response.status(404).json({
        message: "Produto não encontrado",
      });
    }

    if (data.title && data.title !== product.title) {
      const slug = createSlug(data.title);
      const existingProduct = await productsService.findBySlugExceptId(
        slug,
        product.id,
      );

      if (existingProduct) {
        return response.status(409).json({
          message: "Já existe um produto com esse título.",
        });
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
      return response.status(404).json({
        message: "Produto não encontrado",
      });
    }

    const updatedProduct = await productsService.updateStatus(product.id, data);

    return response.json({ product: updatedProduct });
  }

  async sync(request: Request, response: Response) {
    const expectedSecret = process.env.PRODUCT_SYNC_SECRET;
    const receivedSecret = request.header("x-sync-token");

    if (!expectedSecret || receivedSecret !== expectedSecret) {
      return response.status(401).json({
        message: "Não autorizado",
      });
    }

    const products = await syncMercadoLivreProducts();

    return response.json({
      products,
      synced: products.length,
    });
  }

  async showById(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const product = await productsService.findById(id);

    if (!product) {
      return response.status(404).json({
        message: "Produto não encontrado",
      });
    }

    return response.json({ product });
  }

  async show(request: Request, response: Response) {
    const { slug } = slugSchema.parse(request.params);
    const product = await productsService.findBySlug(slug);

    if (!product) {
      return response.status(404).json({
        message: "Produto não encontrado",
      });
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

const mercadoLivreRoutes = Router();
const controller = new MercadoLivreController();

mercadoLivreRoutes.get("/authorize", controller.authorize.bind(controller));
mercadoLivreRoutes.get("/callback", controller.callback.bind(controller));
mercadoLivreRoutes.get("/products", controller.products.bind(controller));

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

## src\services\mercado-livre-service.ts

```ts
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
  available?: boolean | undefined;
  active?: boolean | undefined;
  seoTitle?: string | undefined;
  seoDescription?: string | undefined;
};

type ProductStatusInput = {
  active?: boolean | undefined;
  available?: boolean | undefined;
  featured?: boolean | undefined;
};

type ProductQuery = {
  search?: string | undefined;
  category?: string | undefined;
  subcategoryId?: string | undefined;
  marketplaceId?: string | undefined;
  featured?: boolean | undefined;
};

type ProductAdminQuery = {
  search?: string | undefined;
  subcategoryId?: string | undefined;
  marketplaceId?: string | undefined;
  featured?: boolean | undefined;
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
    const products = await prisma.product.findMany({
      where: {
        active: true,
        available: true,

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

        ...(query.category
          ? {
              subcategory: {
                category: {
                  OR: [
                    {
                      slug: {
                        equals: query.category,
                        mode: "insensitive",
                      },
                    },
                    {
                      name: {
                        equals: query.category,
                        mode: "insensitive",
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
    });

    return serializeProducts(products);
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
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.23.0",
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
  connectMercadoLivre,
  getMercadoLivreAuthorizationUrl,
  getMercadoLivreProducts,
} from "@/services/mercado-livre-service";

export class MercadoLivreController {
  authorize(_request: Request, response: Response) {
    return response.json({
      authorizationUrl: getMercadoLivreAuthorizationUrl(),
    });
  }

  async callback(request: Request, response: Response) {
    const query = z
      .object({ code: z.string(), state: z.string() })
      .parse(request.query);
    await connectMercadoLivre(query.code, query.state);
    return response.redirect(
      `${mercadoLivreConfig.webUrl}/?mercadoLivre=connected`,
    );
  }

  async products(request: Request, response: Response) {
    const query = z
      .object({ search: z.string().optional() })
      .parse(request.query);
    return response.json({
      products: await getMercadoLivreProducts(query.search),
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
  })
  .refine(
    (data) =>
      data.active !== undefined ||
      data.available !== undefined ||
      data.featured !== undefined,
    {
      message: "Informe pelo menos um status para atualizar.",
    },
  );

const idSchema = z.object({
  id: z.string().uuid(),
});

const slugSchema = z.object({
  slug: z.string().trim().min(1),
});

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
      })
      .parse(request.query);

    const products = await productsService.list(query);

    return response.json({
      products,
    });
  }

  async indexAdmin(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        subcategoryId: z.string().uuid().optional(),
        marketplaceId: z.string().uuid().optional(),
        featured: z.coerce.boolean().optional(),
        active: z.coerce.boolean().optional(),
        available: z.coerce.boolean().optional(),
      })
      .parse(request.query);

    const products = await productsService.listAdmin(query);

    return response.json({
      products,
    });
  }

  async create(request: Request, response: Response) {
    const data: CreateProductData = createProductSchema.parse(request.body);
    const slug = createSlug(data.title);
    const existingProduct = await productsService.findBySlug(slug);

    if (existingProduct) {
      return response.status(409).json({
        message: "Já existe um produto com esse título.",
      });
    }

    const product = await productsService.create(data);

    return response.status(201).json({ product });
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const data: UpdateProductData = updateProductSchema.parse(request.body);
    const product = await productsService.findById(id);

    if (!product) {
      return response.status(404).json({
        message: "Produto não encontrado",
      });
    }

    if (data.title && data.title !== product.title) {
      const slug = createSlug(data.title);
      const existingProduct = await productsService.findBySlugExceptId(
        slug,
        product.id,
      );

      if (existingProduct) {
        return response.status(409).json({
          message: "Já existe um produto com esse título.",
        });
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
      return response.status(404).json({
        message: "Produto não encontrado",
      });
    }

    const updatedProduct = await productsService.updateStatus(product.id, data);

    return response.json({ product: updatedProduct });
  }

  async sync(request: Request, response: Response) {
    const expectedSecret = process.env.PRODUCT_SYNC_SECRET;
    const receivedSecret = request.header("x-sync-token");

    if (!expectedSecret || receivedSecret !== expectedSecret) {
      return response.status(401).json({
        message: "Não autorizado",
      });
    }

    const products = await syncMercadoLivreProducts();

    return response.json({
      products,
      synced: products.length,
    });
  }

  async showById(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const product = await productsService.findById(id);

    if (!product) {
      return response.status(404).json({
        message: "Produto não encontrado",
      });
    }

    return response.json({ product });
  }

  async show(request: Request, response: Response) {
    const { slug } = slugSchema.parse(request.params);
    const product = await productsService.findBySlug(slug);

    if (!product) {
      return response.status(404).json({
        message: "Produto não encontrado",
      });
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

const mercadoLivreRoutes = Router();
const controller = new MercadoLivreController();

mercadoLivreRoutes.get("/authorize", controller.authorize.bind(controller));
mercadoLivreRoutes.get("/callback", controller.callback.bind(controller));
mercadoLivreRoutes.get("/products", controller.products.bind(controller));

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

## src\services\mercado-livre-service.ts

```ts
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
  available?: boolean | undefined;
  active?: boolean | undefined;
  seoTitle?: string | undefined;
  seoDescription?: string | undefined;
};

type ProductStatusInput = {
  active?: boolean | undefined;
  available?: boolean | undefined;
  featured?: boolean | undefined;
};

type ProductQuery = {
  search?: string | undefined;
  category?: string | undefined;
  subcategoryId?: string | undefined;
  marketplaceId?: string | undefined;
  featured?: boolean | undefined;
};

type ProductAdminQuery = {
  search?: string | undefined;
  subcategoryId?: string | undefined;
  marketplaceId?: string | undefined;
  featured?: boolean | undefined;
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
    const products = await prisma.product.findMany({
      where: {
        active: true,
        available: true,

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

        ...(query.category
          ? {
              subcategory: {
                category: {
                  OR: [
                    {
                      slug: {
                        equals: query.category,
                        mode: "insensitive",
                      },
                    },
                    {
                      name: {
                        equals: query.category,
                        mode: "insensitive",
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
    });

    return serializeProducts(products);
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
