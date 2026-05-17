import { Link } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { formatMoney } from "../utils/format";

export const CartPage = () => {
  const { items, subtotalCents, removeItem, updateItem } = useCart();
  const taxCents = Math.round(subtotalCents * 0.05);
  const totalCents = subtotalCents + taxCents;

  return (
    <section>
      <h1>Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.itemId}>
                    <td>{item.name}</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={item.quantity}
                        onChange={(event) =>
                          void updateItem(item.itemId, Math.max(1, Number(event.target.value) || 1))
                        }
                      />
                    </td>
                    <td>{formatMoney(item.unitPriceCents)}</td>
                    <td>{formatMoney(item.subtotalCents)}</td>
                    <td>
                      <button className="button danger" onClick={() => void removeItem(item.itemId)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel summary">
            <p>Subtotal: {formatMoney(subtotalCents)}</p>
            <p>Tax (5%): {formatMoney(taxCents)}</p>
            <p>Total: {formatMoney(totalCents)}</p>
            <Link className="button" to="/checkout">
              Proceed to checkout
            </Link>
          </div>
        </>
      )}
    </section>
  );
};
