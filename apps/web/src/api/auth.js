import { apiFetch } from "./client";
export const login = async (email, password) => apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
});
export const register = async (name, email, password) => apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password })
});
export const refresh = async (refreshToken) => apiFetch("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken })
});
export const logout = async (refreshToken) => apiFetch("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken })
});
