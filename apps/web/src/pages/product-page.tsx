import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductBySlug } from "../api/products";
import { useCart } from "../context/cart-context";
import { useAuth } from "../context/auth-context";
import { formatMoney } from "../utils/format";
import type { Product } from "../types/domain";

export const ProductPage = () => {
  const { slug = "" } = useParams();
  const { addItem } = useCart();
  const { session } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const result = await fetchProductBySlug(slug);
      setProduct(result);
    };
    void run();
  }, [slug]);

  if (!product) return <p>Product not found.</p>;

  const onAdd = async () => {
    if (!session) {
      setMessage("Login is required before adding to cart.");
      return;
    }
    await addItem(product.id, quantity);
    setMessage("Added to cart.");
  };

  return (
    <article className="product-layout">
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <div className="panel">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p className="price">{formatMoney(product.unitPriceCents)}</p>
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          min={1}
          max={99}
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
        />
        <button className="button" onClick={() => void onAdd()}>
          Add to cart
        </button>
        {message ? <p className="hint">{message}</p> : null}
      </div>
    </article>
  );
};
