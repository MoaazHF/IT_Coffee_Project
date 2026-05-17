import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { idempotencyKeyMiddleware } from "../middleware/idempotency.js";
import { createCheckoutSessionForUser } from "../services/checkout-service.js";

export const checkoutRouter = Router();

checkoutRouter.post(
  "/checkout/session",
  authMiddleware,
  idempotencyKeyMiddleware,
  async (req, res, next) => {
    try {
      const result = await createCheckoutSessionForUser(req.auth!.sub, req.idempotencyKey!);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }
);
