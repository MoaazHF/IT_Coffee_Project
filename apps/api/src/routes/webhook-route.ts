import { Router } from "express";
import Stripe from "stripe";
import { env } from "../config/env.js";
import { processStripeWebhook } from "../services/checkout-service.js";
import { HttpError } from "../middleware/error-handler.js";

export const webhookRouter = Router();

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

webhookRouter.post("/webhooks/stripe", async (req, res, next) => {
  try {
    if (stripe && env.STRIPE_WEBHOOK_SECRET) {
      const signature = req.headers["stripe-signature"];
      if (typeof signature !== "string") {
        throw new HttpError(400, "INVALID_SIGNATURE", "Missing Stripe signature");
      }

      const event = stripe.webhooks.constructEvent(req.body, signature, env.STRIPE_WEBHOOK_SECRET);
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        await processStripeWebhook(session.id, true);
      }
      if (event.type === "checkout.session.expired") {
        const session = event.data.object as Stripe.Checkout.Session;
        await processStripeWebhook(session.id, false);
      }

      res.status(200).json({ received: true });
      return;
    }

    const parsed = Buffer.isBuffer(req.body)
      ? (JSON.parse(req.body.toString("utf8")) as { sessionId?: string; paid?: boolean })
      : (req.body as { sessionId?: string; paid?: boolean });

    if (!parsed.sessionId) {
      throw new HttpError(400, "INVALID_PAYLOAD", "sessionId required for mock webhook");
    }

    await processStripeWebhook(parsed.sessionId, Boolean(parsed.paid));
    res.status(200).json({ received: true, mode: "mock" });
  } catch (error) {
    next(error);
  }
});
