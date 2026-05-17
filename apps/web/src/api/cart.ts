import { apiFetch } from "./client";
import type { CartItem } from "../types/domain";

export const getCart = async (accessToken: string): Promise<{ items: CartItem[]; subtotalCents: number }> => {
  const response = await apiFetch<{ data: { items: CartItem[]; subtotalCents: number } }>("/cart", {}, accessToken);
  return response.data;
};

export const addCartItem = async (accessToken: string, productId: string, quantity: number): Promise<CartItem[]> => {
  const response = await apiFetch<{ data: CartItem[] }>(
    "/cart/items",
    {
      method: "POST",
      body: JSON.stringify({ productId, quantity })
    },
    accessToken
  );
  return response.data;
};

export const patchCartItem = async (accessToken: string, itemId: string, quantity: number): Promise<CartItem[]> => {
  const response = await apiFetch<{ data: CartItem[] }>(
    `/cart/items/${itemId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ quantity })
    },
    accessToken
  );
  return response.data;
};

export const deleteCartItem = async (accessToken: string, itemId: string): Promise<void> =>
  apiFetch<void>(`/cart/items/${itemId}`, { method: "DELETE" }, accessToken);
