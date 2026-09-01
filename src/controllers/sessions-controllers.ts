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

    const token = jwt.sign({ role: user.role ?? "member" }, secret, options);
    const { password: _, ...userWithoutPassword } = user;

    return response.json({ token, user: userWithoutPassword });
  }
}

export { SessionsController };
