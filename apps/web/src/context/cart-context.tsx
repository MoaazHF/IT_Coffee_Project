import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { addCartItem, deleteCartItem, getCart, patchCartItem } from "../api/cart";
import { cartReducer } from "./cart-reducer";
import { useAuth } from "./auth-context";
import type { CartItem } from "../types/domain";

type CartContextValue = {
  items: CartItem[];
  subtotalCents: number;
  refreshCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const refreshCart = async (): Promise<void> => {
    if (!session?.accessToken) {
      dispatch({ type: "clear" });
      return;
    }

    const data = await getCart(session.accessToken);
    dispatch({ type: "set", payload: data.items });
  };

  useEffect(() => {
    void refreshCart();
  }, [session?.accessToken]);

  const addItem = async (productId: string, quantity = 1): Promise<void> => {
    if (!session?.accessToken) return;
    const items = await addCartItem(session.accessToken, productId, quantity);
    dispatch({ type: "set", payload: items });
  };

  const updateItem = async (itemId: string, quantity: number): Promise<void> => {
    if (!session?.accessToken) return;
    const items = await patchCartItem(session.accessToken, itemId, quantity);
    dispatch({ type: "set", payload: items });
  };

  const removeItem = async (itemId: string): Promise<void> => {
    if (!session?.accessToken) return;
    await deleteCartItem(session.accessToken, itemId);
    await refreshCart();
  };

  const subtotalCents = state.items.reduce((sum, item) => sum + item.subtotalCents, 0);

  const value = useMemo(
    () => ({ items: state.items, subtotalCents, refreshCart, addItem, updateItem, removeItem }),
    [state.items, subtotalCents]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
