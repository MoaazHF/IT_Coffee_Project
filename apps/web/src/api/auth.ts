import { apiFetch } from "./client";
import type { AuthSession } from "../types/domain";

export const login = async (email: string, password: string): Promise<AuthSession> =>
  apiFetch<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

export const register = async (name: string, email: string, password: string): Promise<AuthSession> =>
  apiFetch<AuthSession>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password })
  });

export const refresh = async (refreshToken: string): Promise<AuthSession> =>
  apiFetch<AuthSession>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken })
  });

export const logout = async (refreshToken: string): Promise<void> =>
  apiFetch<void>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken })
  });
