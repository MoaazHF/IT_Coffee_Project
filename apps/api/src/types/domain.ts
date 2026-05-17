export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
  requestId: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  unitPriceCents: number;
  category: "ready-to-go" | "bakery" | "packs";
  isActive: boolean;
};

export type CartItem = {
  itemId: string;
  productId: string;
  quantity: number;
  unitPriceCents: number;
  subtotalCents: number;
  name: string;
  imageUrl: string;
};

export type Order = {
  id: string;
  userId?: string;
  status: "created" | "pending_payment" | "paid" | "failed";
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  paymentProvider: "stripe";
  paymentRef?: string;
  createdAt: string;
};
