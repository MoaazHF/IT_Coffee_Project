import { apiFetch } from "./client";
export const createCheckoutSession = async (accessToken) => {
    const idempotencyKey = crypto.randomUUID();
    const response = await apiFetch("/checkout/session", {
        method: "POST",
        headers: {
            "Idempotency-Key": idempotencyKey
        }
    }, accessToken);
    return response.data;
};
