import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { formatMoney } from "../utils/format";
export const CartPage = () => {
    const { items, subtotalCents, removeItem, updateItem } = useCart();
    const taxCents = Math.round(subtotalCents * 0.05);
    const totalCents = subtotalCents + taxCents;
    return (_jsxs("section", { children: [_jsx("h1", { children: "Cart" }), items.length === 0 ? (_jsx("p", { children: "Your cart is empty." })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "table-wrapper", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Item" }), _jsx("th", { children: "Quantity" }), _jsx("th", { children: "Price" }), _jsx("th", { children: "Total" }), _jsx("th", { children: "Action" })] }) }), _jsx("tbody", { children: items.map((item) => (_jsxs("tr", { children: [_jsx("td", { children: item.name }), _jsx("td", { children: _jsx("input", { type: "number", min: 1, max: 99, value: item.quantity, onChange: (event) => void updateItem(item.itemId, Math.max(1, Number(event.target.value) || 1)) }) }), _jsx("td", { children: formatMoney(item.unitPriceCents) }), _jsx("td", { children: formatMoney(item.subtotalCents) }), _jsx("td", { children: _jsx("button", { className: "button danger", onClick: () => void removeItem(item.itemId), children: "Remove" }) })] }, item.itemId))) })] }) }), _jsxs("div", { className: "panel summary", children: [_jsxs("p", { children: ["Subtotal: ", formatMoney(subtotalCents)] }), _jsxs("p", { children: ["Tax (5%): ", formatMoney(taxCents)] }), _jsxs("p", { children: ["Total: ", formatMoney(totalCents)] }), _jsx(Link, { className: "button", to: "/checkout", children: "Proceed to checkout" })] })] }))] }));
};
