export type ProductCategory = "ready-to-go" | "bakery" | "packs";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  unitPriceCents: number;
  category: ProductCategory;
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

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
};
