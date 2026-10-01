process.env.DATABASE_URL = "postgresql://user:password@localhost:5432/worldmix";
process.env.JWT_SECRET = "test-secret";
process.env.WEB_URL = "http://localhost:5173";
process.env.CORS_ORIGIN = "http://localhost:5173";

jest.mock("../src/routes", () => {
  const express = require("express");
  const router = express.Router();

  router.get("/mock-routes", (_req: any, res: any) => {
    res.json({ ok: true });
  });

  return { routes: router };
});

import request from "supertest";

import { app } from "../src/app";

describe("WorldMix360 API", () => {
  it("GET /health returns status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("applies a mocked router on the app", async () => {
    const response = await request(app).get("/mock-routes");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});
