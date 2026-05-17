import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { addCartItem, deleteCartItem, getCart, patchCartItem } from "../api/cart";
import { cartReducer } from "./cart-reducer";
import { useAuth } from "./auth-context";
const CartContext = createContext(undefined);
export const CartProvider = ({ children }) => {
    const { session } = useAuth();
    const [state, dispatch] = useReducer(cartReducer, { items: [] });
    const refreshCart = async () => {
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
    const addItem = async (productId, quantity = 1) => {
        if (!session?.accessToken)
            return;
        const items = await addCartItem(session.accessToken, productId, quantity);
        dispatch({ type: "set", payload: items });
    };
    const updateItem = async (itemId, quantity) => {
        if (!session?.accessToken)
            return;
        const items = await patchCartItem(session.accessToken, itemId, quantity);
        dispatch({ type: "set", payload: items });
    };
    const removeItem = async (itemId) => {
        if (!session?.accessToken)
            return;
        await deleteCartItem(session.accessToken, itemId);
        await refreshCart();
    };
    const subtotalCents = state.items.reduce((sum, item) => sum + item.subtotalCents, 0);
    const value = useMemo(() => ({ items: state.items, subtotalCents, refreshCart, addItem, updateItem, removeItem }), [state.items, subtotalCents]);
    return _jsx(CartContext.Provider, { value: value, children: children });
};
export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx)
        throw new Error("useCart must be used within CartProvider");
    return ctx;
};
