import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getOrderById } from "../repositories/order-repository.js";
import { HttpError } from "../middleware/error-handler.js";

export const ordersRouter = Router();
ordersRouter.use(authMiddleware);

ordersRouter.get("/orders/:id", async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id, req.auth!.sub);
    if (!order) {
      throw new HttpError(404, "ORDER_NOT_FOUND", "Order not found");
    }
    res.json({ data: order });
  } catch (error) {
    next(error);
  }
});
