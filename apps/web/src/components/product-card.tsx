import { Link } from "react-router-dom";
import type { Product } from "../types/domain";
import { formatMoney } from "../utils/format";

export const ProductCard = ({ product }: { product: Product }) => (
  <article className="card" aria-label={product.name}>
    <img src={product.imageUrl} alt={product.name} loading="lazy" />
    <div className="card-body">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="row between">
        <strong>{formatMoney(product.unitPriceCents)}</strong>
        <Link className="button secondary" to={`/products/${product.slug}`}>
          View
        </Link>
      </div>
    </div>
  </article>
);
