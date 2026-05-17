import { apiFetch } from "./client";
export const getCart = async (accessToken) => {
    const response = await apiFetch("/cart", {}, accessToken);
    return response.data;
};
export const addCartItem = async (accessToken, productId, quantity) => {
    const response = await apiFetch("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId, quantity })
    }, accessToken);
    return response.data;
};
export const patchCartItem = async (accessToken, itemId, quantity) => {
    const response = await apiFetch(`/cart/items/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity })
    }, accessToken);
    return response.data;
};
export const deleteCartItem = async (accessToken, itemId) => apiFetch(`/cart/items/${itemId}`, { method: "DELETE" }, accessToken);
