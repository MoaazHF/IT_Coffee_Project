import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { requestIdMiddleware } from "./middleware/request-id.js";
import { errorHandlerMiddleware, notFoundMiddleware } from "./middleware/error-handler.js";
import { healthRouter } from "./routes/health-route.js";
import { productsRouter } from "./routes/products-route.js";
import { authRouter } from "./routes/auth-route.js";
import { cartRouter } from "./routes/cart-route.js";
import { checkoutRouter } from "./routes/checkout-route.js";
import { webhookRouter } from "./routes/webhook-route.js";
import { ordersRouter } from "./routes/orders-route.js";

export const app = express();

app.use(requestIdMiddleware);
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false
  })
);
app.use(morgan("combined"));

app.use("/api/v1/webhooks/stripe", express.raw({ type: "application/json" }));
app.use(express.json());

app.use("/api/v1", healthRouter);
app.use("/api/v1", productsRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1", cartRouter);
app.use("/api/v1", checkoutRouter);
app.use("/api/v1", ordersRouter);
app.use("/api/v1", webhookRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
