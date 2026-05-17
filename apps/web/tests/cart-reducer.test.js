import { describe, expect, it } from "vitest";
import { cartReducer } from "../src/context/cart-reducer";
describe("cart reducer", () => {
    it("sets items", () => {
        const state = cartReducer({ items: [] }, {
            type: "set",
            payload: [
                {
                    itemId: "1",
                    productId: "p1",
                    quantity: 2,
                    unitPriceCents: 100,
                    subtotalCents: 200,
                    name: "x",
                    imageUrl: "img"
                }
            ]
        });
        expect(state.items).toHaveLength(1);
    });
    it("clears items", () => {
        const state = cartReducer({
            items: [
                {
                    itemId: "1",
                    productId: "p1",
                    quantity: 1,
                    unitPriceCents: 100,
                    subtotalCents: 100,
                    name: "x",
                    imageUrl: "img"
                }
            ]
        }, { type: "clear" });
        expect(state.items).toHaveLength(0);
    });
});
