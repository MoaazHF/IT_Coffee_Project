import { apiFetch } from "./client";

export const createCheckoutSession = async (accessToken: string): Promise<{ checkoutSessionId: string; order: { id: string } }> => {
  const idempotencyKey = crypto.randomUUID();
  const response = await apiFetch<{ data: { checkoutSessionId: string; order: { id: string } } }>(
    "/checkout/session",
    {
      method: "POST",
      headers: {
        "Idempotency-Key": idempotencyKey
      }
    },
    accessToken
  );

  return response.data;
};
