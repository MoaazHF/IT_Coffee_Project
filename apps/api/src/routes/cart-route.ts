import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.js";
import {
  deleteCartItem,
  listCartItems,
  updateCartItemQuantity,
  upsertCartItem
} from "../repositories/cart-repository.js";
import { HttpError } from "../middleware/error-handler.js";

const addSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99)
});

const patchSchema = z.object({
  quantity: z.number().int().min(1).max(99)
});

export const cartRouter = Router();
cartRouter.use(authMiddleware);

cartRouter.get("/cart", async (req, res) => {
  const items = await listCartItems(req.auth!.sub);
  const subtotalCents = items.reduce((acc, item) => acc + item.subtotalCents, 0);
  res.json({ data: { items, subtotalCents } });
});

cartRouter.post("/cart/items", async (req, res, next) => {
  try {
    const data = addSchema.parse(req.body);
    await upsertCartItem(req.auth!.sub, data.productId, data.quantity);
    const items = await listCartItems(req.auth!.sub);
    res.status(201).json({ data: items });
  } catch (error) {
    next(error);
  }
});

cartRouter.patch("/cart/items/:itemId", async (req, res, next) => {
  try {
    const { quantity } = patchSchema.parse(req.body);
    const updated = await updateCartItemQuantity(req.auth!.sub, req.params.itemId, quantity);
    if (!updated) {
      throw new HttpError(404, "CART_ITEM_NOT_FOUND", "Cart item not found");
    }
    const items = await listCartItems(req.auth!.sub);
    res.json({ data: items });
  } catch (error) {
    next(error);
  }
});

cartRouter.delete("/cart/items/:itemId", async (req, res, next) => {
  try {
    const deleted = await deleteCartItem(req.auth!.sub, req.params.itemId);
    if (!deleted) {
      throw new HttpError(404, "CART_ITEM_NOT_FOUND", "Cart item not found");
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
