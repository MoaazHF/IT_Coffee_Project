import { apiFetch } from "./client";
import { localProducts } from "../data/localProducts";
export const fetchProducts = async () => {
    try {
        const response = await apiFetch("/products");
        return response.data;
    }
    catch {
        return localProducts;
    }
};
export const fetchProductBySlug = async (slug) => {
    try {
        const response = await apiFetch(`/products/${slug}`);
        return response.data;
    }
    catch {
        return localProducts.find((p) => p.slug === slug) ?? null;
    }
};
