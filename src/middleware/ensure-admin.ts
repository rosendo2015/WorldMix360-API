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
