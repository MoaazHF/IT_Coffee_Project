import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "../api/checkout";
import { useAuth } from "../context/auth-context";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "");

export const CheckoutPage = () => {
  const { session } = useAuth();
  const [status, setStatus] = useState<string | null>(null);

  const onCheckout = async (): Promise<void> => {
    if (!session) {
      setStatus("Login is required before checkout.");
      return;
    }

    setStatus("Creating checkout session...");
    const { checkoutSessionId } = await createCheckoutSession(session.accessToken);

    if (checkoutSessionId.startsWith("mock_session_")) {
      setStatus(`Mock checkout created: ${checkoutSessionId}`);
      return;
    }

    const stripe = await stripePromise;
    if (!stripe) {
      setStatus("Stripe client failed to load.");
      return;
    }

    const result = await stripe.redirectToCheckout({ sessionId: checkoutSessionId });
    if (result.error) {
      setStatus(result.error.message ?? "Stripe redirection failed");
    }
  };

  return (
    <section className="panel">
      <h1>Checkout</h1>
      <p>Stripe test mode checkout with idempotent session creation.</p>
      <button className="button" onClick={() => void onCheckout()}>
        Start checkout
      </button>
      {status ? <p className="hint">{status}</p> : null}
    </section>
  );
};
