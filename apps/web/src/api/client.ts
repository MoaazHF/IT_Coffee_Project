const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export const apiFetch = async <T>(
  path: string,
  options?: RequestInit,
  accessToken?: string
): Promise<T> => {
  const headers = new Headers(options?.headers);
  headers.set("Content-Type", "application/json");
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ code: "HTTP_ERROR", message: "Request failed" }));
    throw new ApiError(response.status, body.code ?? "HTTP_ERROR", body.message ?? "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
