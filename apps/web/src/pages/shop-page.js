import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../api/products";
import { ProductCard } from "../components/product-card";
export const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const run = async () => {
            const result = await fetchProducts();
            setProducts(result);
            setLoading(false);
        };
        void run();
    }, []);
    const grouped = useMemo(() => {
        return {
            "ready-to-go": products.filter((p) => p.category === "ready-to-go"),
            bakery: products.filter((p) => p.category === "bakery"),
            packs: products.filter((p) => p.category === "packs")
        };
    }, [products]);
    if (loading)
        return _jsx("p", { children: "Loading products..." });
    return (_jsxs("section", { children: [_jsx("h1", { children: "Shop" }), ["ready-to-go", "bakery", "packs"].map((category) => (_jsxs("section", { className: "section-block", children: [_jsx("h2", { children: category.replaceAll("-", " ") }), _jsx("div", { className: "grid cards-grid", children: grouped[category].map((product) => (_jsx(ProductCard, { product: product }, product.id))) })] }, category)))] }));
};
