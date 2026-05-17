import { Router } from "express";
import { listProducts, getProductBySlug } from "../repositories/product-repository.js";
import { HttpError } from "../middleware/error-handler.js";

export const productsRouter = Router();

productsRouter.get("/products", async (_req, res) => {
  const products = await listProducts();
  res.setHeader("Cache-Control", "public, max-age=60");
  res.json({ data: products });
});

productsRouter.get("/products/:slug", async (req, res, next) => {
  try {
    const product = await getProductBySlug(req.params.slug);
    if (!product) {
      throw new HttpError(404, "PRODUCT_NOT_FOUND", "Product not found");
    }
    res.setHeader("Cache-Control", "public, max-age=120");
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
});
