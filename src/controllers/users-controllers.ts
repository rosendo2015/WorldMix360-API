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
