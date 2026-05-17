import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { HttpError } from "./error-handler.js";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const raw = req.headers.authorization;
  if (!raw || !raw.startsWith("Bearer ")) {
    next(new HttpError(401, "UNAUTHORIZED", "Missing bearer token"));
    return;
  }

  try {
    const token = raw.slice(7);
    req.auth = verifyAccessToken(token);
    next();
  } catch {
    next(new HttpError(401, "UNAUTHORIZED", "Invalid access token"));
  }
};
