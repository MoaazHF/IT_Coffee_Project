import type { CartItem } from "../types/domain";

export type CartState = {
  items: CartItem[];
};

export type CartAction =
  | { type: "set"; payload: CartItem[] }
  | { type: "clear" }
  | { type: "upsert"; payload: CartItem };

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "set":
      return { items: action.payload };
    case "clear":
      return { items: [] };
    case "upsert": {
      const index = state.items.findIndex((item) => item.itemId === action.payload.itemId);
      if (index === -1) {
        return { items: [...state.items, action.payload] };
      }
      const next = [...state.items];
      next[index] = action.payload;
      return { items: next };
    }
    default:
      return state;
  }
};
