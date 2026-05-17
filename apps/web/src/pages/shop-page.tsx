import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../api/products";
import { ProductCard } from "../components/product-card";
import type { Product } from "../types/domain";

export const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
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

  if (loading) return <p>Loading products...</p>;

  return (
    <section>
      <h1>Shop</h1>
      {(["ready-to-go", "bakery", "packs"] as const).map((category) => (
        <section key={category} className="section-block">
          <h2>{category.replaceAll("-", " ")}</h2>
          <div className="grid cards-grid">
            {grouped[category].map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </section>
  );
};
