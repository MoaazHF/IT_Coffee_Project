import { Router } from "express";
import { z } from "zod";
import { loginUser, logoutSession, refreshUserSession, registerUser } from "../services/auth-service.js";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const refreshSchema = z.object({ refreshToken: z.string().min(10) });

export const authRouter = Router();

authRouter.post("/auth/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await registerUser(data.name, data.email, data.password);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/auth/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data.email, data.password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/auth/refresh", async (req, res, next) => {
  try {
    const data = refreshSchema.parse(req.body);
    const result = await refreshUserSession(data.refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/auth/logout", async (req, res, next) => {
  try {
    const data = refreshSchema.parse(req.body);
    await logoutSession(data.refreshToken);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
