import { apiFetch } from "./client";
import type { Product } from "../types/domain";
import { localProducts } from "../data/localProducts";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiFetch<{ data: Product[] }>("/products");
    return response.data;
  } catch {
    return localProducts;
  }
};

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const response = await apiFetch<{ data: Product }>(`/products/${slug}`);
    return response.data;
  } catch {
    return localProducts.find((p) => p.slug === slug) ?? null;
  }
};
