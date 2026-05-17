import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductBySlug } from "../api/products";
import { useCart } from "../context/cart-context";
import { useAuth } from "../context/auth-context";
import { formatMoney } from "../utils/format";
export const ProductPage = () => {
    const { slug = "" } = useParams();
    const { addItem } = useCart();
    const { session } = useAuth();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        const run = async () => {
            const result = await fetchProductBySlug(slug);
            setProduct(result);
        };
        void run();
    }, [slug]);
    if (!product)
        return _jsx("p", { children: "Product not found." });
    const onAdd = async () => {
        if (!session) {
            setMessage("Login is required before adding to cart.");
            return;
        }
        await addItem(product.id, quantity);
        setMessage("Added to cart.");
    };
    return (_jsxs("article", { className: "product-layout", children: [_jsx("img", { src: product.imageUrl, alt: product.name, className: "product-image" }), _jsxs("div", { className: "panel", children: [_jsx("h1", { children: product.name }), _jsx("p", { children: product.description }), _jsx("p", { className: "price", children: formatMoney(product.unitPriceCents) }), _jsx("label", { htmlFor: "quantity", children: "Quantity" }), _jsx("input", { id: "quantity", type: "number", min: 1, max: 99, value: quantity, onChange: (event) => setQuantity(Math.max(1, Number(event.target.value) || 1)) }), _jsx("button", { className: "button", onClick: () => void onAdd(), children: "Add to cart" }), message ? _jsx("p", { className: "hint", children: message }) : null] })] }));
};
