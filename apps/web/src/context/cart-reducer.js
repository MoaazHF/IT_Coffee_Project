export const cartReducer = (state, action) => {
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
