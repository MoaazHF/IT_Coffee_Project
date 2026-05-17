import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { formatMoney } from "../utils/format";
export const ProductCard = ({ product }) => (_jsxs("article", { className: "card", "aria-label": product.name, children: [_jsx("img", { src: product.imageUrl, alt: product.name, loading: "lazy" }), _jsxs("div", { className: "card-body", children: [_jsx("h3", { children: product.name }), _jsx("p", { children: product.description }), _jsxs("div", { className: "row between", children: [_jsx("strong", { children: formatMoney(product.unitPriceCents) }), _jsx(Link, { className: "button secondary", to: `/products/${product.slug}`, children: "View" })] })] })] }));
