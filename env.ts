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
