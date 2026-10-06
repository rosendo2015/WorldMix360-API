process.env.DATABASE_URL = "postgresql://user:password@localhost:5432/worldmix";
process.env.JWT_SECRET = "test-secret";
process.env.WEB_URL = "http://localhost:5173";
process.env.CORS_ORIGIN = "http://localhost:5173";

jest.mock("../src/routes", () => {
  const express = require("express");
  const router = express.Router();
  const {
    SessionsController,
  } = require("../src/controllers/sessions-controllers");
  const {
    ensureAuthenticated,
  } = require("../src/middleware/ensure-authenticated");
  const { ensureAdmin } = require("../src/middleware/ensure-admin");
  const sessionsController = new SessionsController();

  router.get("/mock-routes", (_req: any, res: any) => {
    res.json({ ok: true });
  });

  router.post("/session", async (req: any, res: any, next: any) => {
    try {
      await sessionsController.create(req, res);
    } catch (error) {
      next(error);
    }
  });

  router.get(
    "/protected-admin",
    ensureAuthenticated,
    ensureAdmin,
    (_req: any, res: any) => {
      res.json({ ok: true });
    },
  );

  return { routes: router };
});

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { z } from "zod";

import { app } from "../src/app";
import { CategoryController } from "../src/controllers/categories-controllers";
import { MercadoLivreController } from "../src/controllers/mercado-livre-controller";
import { ProductsController } from "../src/controllers/products-controller";
import { SessionsController } from "../src/controllers/sessions-controllers";
import { UserController } from "../src/controllers/users-controllers";
import { prisma } from "../src/database/prisma";
import { ensureAdmin } from "../src/middleware/ensure-admin";
import { ensureAuthenticated } from "../src/middleware/ensure-authenticated";
import { errorHandling } from "../src/middleware/error-handling";
import { categoryService } from "../src/services/categories-service";
import { syncMercadoLivreProducts } from "../src/services/mercado-livre-service";
import { productsService } from "../src/services/products-service";
import { AppError } from "../src/utils/AppError";

jest.mock("../src/database/prisma", () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("../src/services/categories-service", () => ({
  categoryService: {
    list: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("../src/services/products-service", () => ({
  productsService: {
    list: jest.fn(),
    listAdmin: jest.fn(),
    findBySlug: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findBySlugExceptId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateStatus: jest.fn(),
  },
}));

jest.mock("../src/services/mercado-livre-service", () => ({
  syncMercadoLivreProducts: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const { hash, compare } = jest.requireMock("bcrypt");

describe("WorldMix360 API", () => {
  it("GET /health returns status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("applies the CORS headers and handles OPTIONS preflight", async () => {
    const response = await request(app)
      .options("/health")
      .set("Origin", "http://localhost:5173");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173",
    );
  });

  it("serves a mocked route mounted in the app", async () => {
    const response = await request(app).get("/mock-routes");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});

describe("ensureAuthenticated", () => {
  it("throws when bearer token is missing", () => {
    const req = { headers: {} } as Partial<Request> as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    expect(() => ensureAuthenticated(req, res, next)).toThrow(
      "Token não informado",
    );
  });

  it("throws when bearer token is malformed", () => {
    const req = {
      headers: { authorization: "invalid-token" },
    } as Partial<Request> as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    expect(() => ensureAuthenticated(req, res, next)).toThrow("Token inválido");
  });

  it("accepts a valid token and attaches the user payload", () => {
    const token = jwt.sign(
      { sub: "user-1", role: "admin" },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as Partial<Request> as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    ensureAuthenticated(req, res, next);

    expect(req.user).toEqual({ id: "user-1", role: "admin" });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("throws when token is expired or invalid", () => {
    const token = "invalid.jwt.token";
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as Partial<Request> as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    expect(() => ensureAuthenticated(req, res, next)).toThrow(
      "Token inválido ou expirado",
    );
  });
});

describe("ensureAdmin", () => {
  it("allows admin users", () => {
    const req = { user: { role: "admin" } } as Request & {
      user: { role: string };
    };
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    ensureAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("blocks non-admin users", () => {
    const req = { user: { role: "user" } } as Request & {
      user: { role: string };
    };
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    expect(() => ensureAdmin(req, res, next)).toThrow(
      "Acesso permitido somente para administradores",
    );
  });
});

describe("errorHandling", () => {
  it("returns the AppError payload with the matching status code", () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    errorHandling(new AppError("teste de erro", 418), req, res, next);

    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({ message: "teste de erro" });
  });

  it("returns a validation error payload for Zod issues", () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    const parsed = z.object({ name: z.string() }).safeParse({ name: 123 });

    if (parsed.success) {
      throw new Error("safeParse should have failed");
    }

    errorHandling(new z.ZodError(parsed.error.issues), req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Validation error",
      }),
    );
  });

  it("returns a generic 500 for unexpected errors", () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    errorHandling(new Error("unexpected failure"), req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "unexpected failure" });
  });
});

describe("UserController", () => {
  const controller = new UserController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a user with a hashed password and omits password from response", async () => {
    const req = {
      body: {
        name: "Alice",
        email: "alice@email.com",
        password: "123456",
      },
    } as any;
    const res = { json: jest.fn() } as any;
    const next = jest.fn();

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (hash as jest.Mock).mockResolvedValue("hashed-password");
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "user-1",
      name: "Alice",
      email: "alice@email.com",
      password: "hashed-password",
      role: "customer",
      createdAt: new Date(),
      updatedAt: null,
    });

    await controller.create(req, res, next);

    expect(hash).toHaveBeenCalledWith("123456", 8);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: "Alice",
        email: "alice@email.com",
        password: "hashed-password",
      },
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "user-1",
        email: "alice@email.com",
      }),
    );
    expect(res.json.mock.calls[0][0].password).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects duplicate email on user creation", async () => {
    const req = {
      body: {
        name: "Alice",
        email: "alice@email.com",
        password: "123456",
      },
    } as any;
    const res = {} as any;
    const next = jest.fn();

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "user-1" });

    await controller.create(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Email already exists" }),
    );
  });

  it("rejects invalid user payload before persisting", async () => {
    const req = {
      body: {
        name: "Al",
        email: "invalid-email",
        password: "123",
      },
    } as any;
    const res = {} as any;
    const next = jest.fn();

    await controller.create(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it("updates a user password and omits password from response", async () => {
    const req = {
      params: { id: "123e4567-e89b-12d3-a456-426614174000" },
      body: { password: "new-secret" },
    } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();

    (hash as jest.Mock).mockResolvedValue("new-hash");
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Alice",
      email: "alice@email.com",
      password: "old-hash",
      role: "customer",
    });
    (prisma.user.update as jest.Mock).mockResolvedValue({
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Alice",
      email: "alice@email.com",
      password: "new-hash",
      role: "customer",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await controller.update(req, res, next);

    expect(hash).toHaveBeenCalledWith("new-secret", 8);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "123e4567-e89b-12d3-a456-426614174000" },
      data: { password: "new-hash" },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "alice@email.com",
      }),
    );
    expect(res.json.mock.calls[0][0].password).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects update when no valid field is provided", async () => {
    const req = {
      params: { id: "123e4567-e89b-12d3-a456-426614174000" },
      body: {},
    } as any;
    const res = {} as any;
    const next = jest.fn();

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Alice",
      email: "alice@email.com",
      password: "old-hash",
      role: "customer",
    });

    await controller.update(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Nenhum campo informado para atualização",
      }),
    );
  });
});

describe("CategoryController", () => {
  const controller = new CategoryController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 409 when trying to create a category with a duplicate slug", async () => {
    const req = {
      body: {
        name: "Eletrônicos",
        description: "test",
        image: "https://example.com/1.png",
      },
    } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    (prisma.category.findUnique as jest.Mock).mockResolvedValue({
      id: "cat-1",
      slug: "eletronicos",
    });

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Já existe uma categoria com esse nome.",
    });
  });

  it("returns 409 when updating a category with a duplicate slug", async () => {
    const req = {
      params: { id: "123e4567-e89b-12d3-a456-426614174000" },
      body: { name: "Eletrônicos" },
    } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    (prisma.category.findUnique as jest.Mock).mockResolvedValue({
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Casa",
      slug: "casa",
    });
    (prisma.category.findFirst as jest.Mock).mockResolvedValue({
      id: "cat-2",
      slug: "eletronicos",
    });

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Já existe uma categoria com esse nome.",
    });
  });

  it("lists categories through the service", async () => {
    const req = {} as any;
    const res = { json: jest.fn() } as any;

    (categoryService.list as jest.Mock).mockResolvedValue([{ id: "cat-1" }]);

    await controller.list(req, res);

    expect(categoryService.list).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith([{ id: "cat-1" }]);
  });

  it("returns 404 when getting a category that does not exist", async () => {
    const req = {
      params: { id: "123e4567-e89b-12d3-a456-426614174000" },
    } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    (categoryService.get as jest.Mock).mockResolvedValue(null);

    await controller.get(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Categoria não encontrada",
    });
  });

  it("deletes a category and returns 204", async () => {
    const req = {
      params: { id: "123e4567-e89b-12d3-a456-426614174000" },
    } as any;
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;

    await controller.delete(req, res);

    expect(categoryService.delete).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174000",
    );
    expect(res.status).toHaveBeenCalledWith(204);
  });
});

describe("ProductsController", () => {
  const controller = new ProductsController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects product sync when x-sync-token does not match", async () => {
    const req = {
      header: jest.fn().mockReturnValue("wrong-token"),
      env: { PRODUCT_SYNC_SECRET: "secret" },
    } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    process.env.PRODUCT_SYNC_SECRET = "secret";

    await controller.sync(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Não autorizado" });
  });

  it("calls the list service with parsed query params", async () => {
    const req = {
      query: {
        search: "tv",
        page: "2",
        limit: "10",
        sort: "price_asc",
      },
    } as any;
    const res = { json: jest.fn() } as any;

    (productsService.list as jest.Mock).mockResolvedValue({
      products: [],
      total: 0,
    });

    await controller.index(req, res);

    expect(productsService.list).toHaveBeenCalledWith(
      expect.objectContaining({
        search: "tv",
        page: 2,
        limit: 10,
        sort: "price_asc",
      }),
    );
    expect(res.json).toHaveBeenCalledWith({ products: [], total: 0 });
  });

  it("calls the admin list service with parsed filters", async () => {
    const req = {
      query: {
        search: "celular",
        active: "true",
        available: "false",
      },
    } as any;
    const res = { json: jest.fn() } as any;

    (productsService.listAdmin as jest.Mock).mockResolvedValue([
      { id: "prod-1" },
    ]);

    await controller.indexAdmin(req, res);

    expect(productsService.listAdmin).toHaveBeenCalledWith(
      expect.objectContaining({
        search: "celular",
        active: true,
        available: true,
      }),
    );
    expect(res.json).toHaveBeenCalledWith({ products: [{ id: "prod-1" }] });
  });

  it("creates a product when the slug is unique", async () => {
    const req = {
      body: {
        title: "Notebook Gamer",
        description: "Muito bom",
        imageUrl: "https://example.com/notebook.png",
        price: 3999,
        affiliateUrl: "https://example.com/afiliado",
        subcategoryId: "123e4567-e89b-12d3-a456-426614174000",
        marketplaceId: "123e4567-e89b-12d3-a456-426614174001",
      },
    } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    (productsService.findBySlug as jest.Mock).mockResolvedValue(null);
    (productsService.create as jest.Mock).mockResolvedValue({
      id: "prod-2",
      title: "Notebook Gamer",
    });

    await controller.create(req, res);

    expect(productsService.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Notebook Gamer" }),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      product: { id: "prod-2", title: "Notebook Gamer" },
    });
  });

  it("rejects product creation when the title already exists", async () => {
    const req = {
      body: {
        title: "Notebook Gamer",
        imageUrl: "https://example.com/notebook.png",
        price: 3999,
        affiliateUrl: "https://example.com/afiliado",
        subcategoryId: "123e4567-e89b-12d3-a456-426614174000",
        marketplaceId: "123e4567-e89b-12d3-a456-426614174001",
      },
    } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    (productsService.findBySlug as jest.Mock).mockResolvedValue({
      id: "prod-1",
    });

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Já existe um produto com esse título.",
    });
  });

  it("returns 404 when updating a product that does not exist", async () => {
    const req = {
      params: { id: "123e4567-e89b-12d3-a456-426614174000" },
      body: { title: "Novo título" },
    } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    (productsService.findById as jest.Mock).mockResolvedValue(null);

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Produto não encontrado",
    });
  });

  it("deletes an existing product", async () => {
    const req = {
      params: { id: "123e4567-e89b-12d3-a456-426614174000" },
    } as any;
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;

    (productsService.findById as jest.Mock).mockResolvedValue({
      id: "123e4567-e89b-12d3-a456-426614174000",
    });
    (productsService.delete as jest.Mock).mockResolvedValue(undefined);

    await controller.delete(req, res);

    expect(productsService.delete).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174000",
    );
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("returns 404 when deleting a product that does not exist", async () => {
    const req = {
      params: { id: "123e4567-e89b-12d3-a456-426614174000" },
    } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    (productsService.findById as jest.Mock).mockResolvedValue(null);

    await controller.delete(req, res);

    expect(productsService.delete).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Produto não encontrado",
    });
  });

  it("rejects update when another product uses the new title", async () => {
    const req = {
      params: { id: "123e4567-e89b-12d3-a456-426614174000" },
      body: { title: "Novo Título" },
    } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    (productsService.findById as jest.Mock).mockResolvedValue({
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Título Antigo",
    });
    (productsService.findBySlugExceptId as jest.Mock).mockResolvedValue({
      id: "prod-2",
    });

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Já existe um produto com esse título.",
    });
  });

  it("updates product status for an existing product", async () => {
    const req = {
      params: { id: "123e4567-e89b-12d3-a456-426614174000" },
      body: { active: true, available: false },
    } as any;
    const res = { json: jest.fn() } as any;

    (productsService.findById as jest.Mock).mockResolvedValue({
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Notebook Gamer",
    });
    (productsService.updateStatus as jest.Mock).mockResolvedValue({
      id: "123e4567-e89b-12d3-a456-426614174000",
      active: true,
      available: false,
    });

    await controller.updateStatus(req, res);

    expect(productsService.updateStatus).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174000",
      { active: true, available: false },
    );
    expect(res.json).toHaveBeenCalledWith({
      product: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        active: true,
        available: false,
      },
    });
  });

  it("synchronizes products when the secret matches", async () => {
    const req = {
      header: jest.fn().mockReturnValue("super-secret"),
    } as any;
    const res = { json: jest.fn() } as any;

    process.env.PRODUCT_SYNC_SECRET = "super-secret";
    (syncMercadoLivreProducts as jest.Mock).mockResolvedValue({
      products: [{ id: "prod-1" }, { id: "prod-2" }],
    });

    await controller.sync(req, res);

    expect(syncMercadoLivreProducts).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      products: [{ id: "prod-1" }, { id: "prod-2" }],
      synced: 2,
    });
  });

  it("finds a product by id and by slug", async () => {
    const idReq = {
      params: { id: "123e4567-e89b-12d3-a456-426614174000" },
    } as any;
    const slugReq = {
      params: { slug: "notebook-gamer" },
    } as any;
    const idRes = { json: jest.fn() } as any;
    const slugRes = { json: jest.fn() } as any;

    (productsService.findById as jest.Mock).mockResolvedValue({
      id: "123e4567-e89b-12d3-a456-426614174000",
    });
    (productsService.findBySlug as jest.Mock).mockResolvedValue({
      id: "prod-9",
      slug: "notebook-gamer",
    });

    await controller.showById(idReq, idRes);
    await controller.show(slugReq, slugRes);

    expect(productsService.findById).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174000",
    );
    expect(productsService.findBySlug).toHaveBeenCalledWith("notebook-gamer");
    expect(idRes.json).toHaveBeenCalledWith({
      product: { id: "123e4567-e89b-12d3-a456-426614174000" },
    });
    expect(slugRes.json).toHaveBeenCalledWith({
      product: { id: "prod-9", slug: "notebook-gamer" },
    });
  });

  it("returns 404 when showing a product by id or slug and it does not exist", async () => {
    const idReq = {
      params: { id: "123e4567-e89b-12d3-a456-426614174000" },
    } as any;
    const slugReq = {
      params: { slug: "notebook-gamer" },
    } as any;
    const idRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    const slugRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    (productsService.findById as jest.Mock).mockResolvedValue(null);
    (productsService.findBySlug as jest.Mock).mockResolvedValue(null);

    await controller.showById(idReq, idRes);
    await controller.show(slugReq, slugRes);

    expect(idRes.status).toHaveBeenCalledWith(404);
    expect(idRes.json).toHaveBeenCalledWith({
      message: "Produto não encontrado",
    });
    expect(slugRes.status).toHaveBeenCalledWith(404);
    expect(slugRes.json).toHaveBeenCalledWith({
      message: "Produto não encontrado",
    });
  });
});

describe("MercadoLivreController", () => {
  const controller = new MercadoLivreController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a successful summary when every product syncs", async () => {
    const result = {
      message: "Sincronização concluída: 2 atualizado(s), 0 indisponível(is).",
      summary: { total: 2, updated: 2, unavailable: 0, failed: 0 },
      products: [
        { id: "offer-1", productId: "product-1", productTitle: "Produto 1", status: "SUCCESS" },
        { id: "offer-2", productId: "product-2", productTitle: "Produto 2", status: "SUCCESS" },
      ],
    };
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    (syncMercadoLivreProducts as jest.Mock).mockResolvedValue(result);

    await controller.sync({} as Request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(result);
  });

  it("returns multi-status when any product sync fails", async () => {
    const result = {
      message: "Sincronização parcial: 1 atualizado(s), 0 indisponível(is) e 1 com falha.",
      summary: { total: 2, updated: 1, unavailable: 0, failed: 1 },
      products: [
        { id: "offer-1", productId: "product-1", productTitle: "Produto 1", status: "SUCCESS" },
        {
          id: "offer-2",
          productId: "product-2",
          productTitle: "Produto 2",
          status: "ERROR",
          error: "Token do Mercado Livre expirado.",
        },
      ],
    };
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    (syncMercadoLivreProducts as jest.Mock).mockResolvedValue(result);

    await controller.sync({} as Request, response);

    expect(response.status).toHaveBeenCalledWith(207);
    expect(response.json).toHaveBeenCalledWith(result);
  });
});

describe("SessionsController", () => {
  const controller = new SessionsController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a token and user data when credentials are valid", async () => {
    const req = {
      body: {
        email: "alice@email.com",
        password: "123456",
      },
    } as any;
    const res = { json: jest.fn() } as any;

    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: "user-1",
      name: "Alice",
      email: "alice@email.com",
      password: "hashed-password",
      role: "admin",
    });
    (compare as jest.Mock).mockResolvedValue(true);

    await controller.create(req, res);

    expect(compare).toHaveBeenCalledWith("123456", "hashed-password");
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({
          id: "user-1",
          email: "alice@email.com",
        }),
      }),
    );
    expect(res.json.mock.calls[0][0].token).toEqual(expect.any(String));
  });

  it("throws when email is not registered", async () => {
    const req = {
      body: {
        email: "missing@email.com",
        password: "123456",
      },
    } as any;
    const res = {} as any;

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(controller.create(req, res)).rejects.toMatchObject({
      message: "Email or Password invalid!",
      statusCode: 401,
    });
  });

  it("throws when password does not match", async () => {
    const req = {
      body: {
        email: "alice@email.com",
        password: "wrong-password",
      },
    } as any;
    const res = {} as any;

    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: "user-1",
      email: "alice@email.com",
      password: "hashed-password",
      role: "customer",
    });
    (compare as jest.Mock).mockResolvedValue(false);

    await expect(controller.create(req, res)).rejects.toMatchObject({
      message: "Email or Password invalid!",
      statusCode: 401,
    });
  });

  it("accepts a session login through the mounted /session route", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: "user-1",
      name: "Alice",
      email: "alice@email.com",
      password: "hashed-password",
      role: "admin",
    });
    (compare as jest.Mock).mockResolvedValue(true);

    const response = await request(app).post("/session").send({
      email: "alice@email.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          id: "user-1",
          email: "alice@email.com",
          role: "admin",
        }),
      }),
    );
    expect(response.body.user.password).toBeUndefined();
  });
});

describe("Protected routes", () => {
  it("rejects access without token", async () => {
    const response = await request(app).get("/protected-admin");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Token não informado" });
  });

  it("allows admin users with a valid bearer token", async () => {
    const token = jwt.sign(
      { sub: "user-1", role: "admin" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    const response = await request(app)
      .get("/protected-admin")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });

  it("blocks non-admin users even with a valid token", async () => {
    const token = jwt.sign(
      { sub: "user-2", role: "customer" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    const response = await request(app)
      .get("/protected-admin")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Acesso permitido somente para administradores",
    });
  });
});
