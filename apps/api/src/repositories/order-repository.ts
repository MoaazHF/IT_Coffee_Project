import { pool } from "../db/pool.js";
import type { CartItem, Order } from "../types/domain.js";

const toOrder = (row: any): Order => ({
  id: row.id,
  userId: row.user_id ?? undefined,
  status: row.status,
  subtotalCents: row.subtotal_cents,
  taxCents: row.tax_cents,
  totalCents: row.total_cents,
  paymentProvider: row.payment_provider,
  paymentRef: row.payment_ref ?? undefined,
  createdAt: row.created_at
});

export const getOrderByIdempotencyKey = async (
  userId: string,
  idempotencyKey: string
): Promise<Order | null> => {
  const { rows } = await pool.query(
    `SELECT * FROM orders WHERE user_id = $1 AND idempotency_key = $2 LIMIT 1`,
    [userId, idempotencyKey]
  );
  return rows[0] ? toOrder(rows[0]) : null;
};

export const createOrder = async (
  userId: string,
  subtotalCents: number,
  taxCents: number,
  totalCents: number,
  idempotencyKey: string,
  cartItems: CartItem[]
): Promise<Order> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO orders (user_id, status, subtotal_cents, tax_cents, total_cents, payment_provider, idempotency_key)
       VALUES ($1, 'pending_payment', $2, $3, $4, 'stripe', $5)
       RETURNING *`,
      [userId, subtotalCents, taxCents, totalCents, idempotencyKey]
    );

    const order = rows[0];

    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents, subtotal_cents)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.productId, item.quantity, item.unitPriceCents, item.subtotalCents]
      );
    }

    await client.query("COMMIT");
    return toOrder(order);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const setOrderPaymentRef = async (orderId: string, paymentRef: string): Promise<void> => {
  await pool.query(`UPDATE orders SET payment_ref = $1 WHERE id = $2`, [paymentRef, orderId]);
};

export const updateOrderStatusByPaymentRef = async (paymentRef: string, status: Order["status"]): Promise<void> => {
  await pool.query(`UPDATE orders SET status = $1 WHERE payment_ref = $2`, [status, paymentRef]);
};

export const getOrderById = async (orderId: string, userId: string): Promise<Order | null> => {
  const { rows } = await pool.query(`SELECT * FROM orders WHERE id = $1 AND user_id = $2 LIMIT 1`, [orderId, userId]);
  return rows[0] ? toOrder(rows[0]) : null;
};
