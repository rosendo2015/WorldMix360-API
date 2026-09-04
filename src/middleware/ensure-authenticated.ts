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
