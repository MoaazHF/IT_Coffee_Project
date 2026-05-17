import type { NextFunction, Request, Response } from "express";
import { HttpError } from "./error-handler.js";

export const idempotencyKeyMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const idempotencyKey = req.headers["idempotency-key"];
  if (typeof idempotencyKey !== "string" || idempotencyKey.trim().length < 8) {
    next(new HttpError(400, "INVALID_IDEMPOTENCY_KEY", "Idempotency-Key header is required"));
    return;
  }

  req.idempotencyKey = idempotencyKey.trim();
  next();
};
