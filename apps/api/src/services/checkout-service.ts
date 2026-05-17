import Stripe from "stripe";
import { env } from "../config/env.js";
import { listCartItems } from "../repositories/cart-repository.js";
import {
  createOrder,
  getOrderByIdempotencyKey,
  setOrderPaymentRef,
  updateOrderStatusByPaymentRef
} from "../repositories/order-repository.js";
import { calculateTaxCents, calculateTotalCents } from "../utils/money.js";
import { HttpError } from "../middleware/error-handler.js";

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

export const createCheckoutSessionForUser = async (userId: string, idempotencyKey: string) => {
  const existing = await getOrderByIdempotencyKey(userId, idempotencyKey);
  if (existing?.paymentRef) {
    return {
      order: existing,
      checkoutSessionId: existing.paymentRef,
      reused: true
    };
  }

  const cartItems = await listCartItems(userId);
  if (cartItems.length === 0) {
    throw new HttpError(400, "EMPTY_CART", "Cannot checkout with empty cart");
  }

  const subtotalCents = cartItems.reduce((sum, item) => sum + item.subtotalCents, 0);
  const taxCents = calculateTaxCents(subtotalCents);
  const totalCents = calculateTotalCents(subtotalCents);

  const order = await createOrder(userId, subtotalCents, taxCents, totalCents, idempotencyKey, cartItems);

  const fallbackRef = `mock_session_${order.id}`;

  if (!stripe) {
    await setOrderPaymentRef(order.id, fallbackRef);
    return {
      order,
      checkoutSessionId: fallbackRef,
      reused: false
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: cartItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: item.unitPriceCents,
          product_data: {
            name: item.name,
            images: []
          }
        }
      })),
      success_url: "http://localhost:5173/thank-you?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/checkout?status=cancelled",
      metadata: {
        orderId: order.id,
        userId
      }
    });

    await setOrderPaymentRef(order.id, session.id);

    return {
      order,
      checkoutSessionId: session.id,
      reused: false
    };
  } catch {
    await setOrderPaymentRef(order.id, fallbackRef);
    return {
      order,
      checkoutSessionId: fallbackRef,
      reused: false
    };
  }
};

export const processStripeWebhook = async (sessionId: string, paid: boolean): Promise<void> => {
  await updateOrderStatusByPaymentRef(sessionId, paid ? "paid" : "failed");
};
