import { pool } from "../db/pool.js";
import type { CartItem } from "../types/domain.js";

type CartRow = {
  item_id: string;
  product_id: string;
  quantity: number;
  unit_price_cents: number;
  name: string;
  image_url: string;
};

const toCartItem = (row: CartRow): CartItem => ({
  itemId: row.item_id,
  productId: row.product_id,
  quantity: Number(row.quantity),
  unitPriceCents: Number(row.unit_price_cents),
  subtotalCents: Number(row.unit_price_cents) * Number(row.quantity),
  name: row.name,
  imageUrl: row.image_url
});

export const listCartItems = async (userId: string): Promise<CartItem[]> => {
  const { rows } = await pool.query(
    `SELECT c.id AS item_id, p.id AS product_id, c.quantity, p.unit_price_cents, p.name, p.image_url
     FROM cart_items c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1
     ORDER BY c.created_at ASC`,
    [userId]
  );
  return rows.map((row) => toCartItem(row as CartRow));
};

export const upsertCartItem = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<void> => {
  await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = NOW()`,
    [userId, productId, quantity]
  );
};

export const updateCartItemQuantity = async (
  userId: string,
  itemId: string,
  quantity: number
): Promise<boolean> => {
  const result = await pool.query(
    `UPDATE cart_items SET quantity = $1, updated_at = NOW()
     WHERE id = $2 AND user_id = $3`,
    [quantity, itemId, userId]
  );
  return (result.rowCount ?? 0) > 0;
};

export const deleteCartItem = async (userId: string, itemId: string): Promise<boolean> => {
  const result = await pool.query(`DELETE FROM cart_items WHERE id = $1 AND user_id = $2`, [itemId, userId]);
  return (result.rowCount ?? 0) > 0;
};

export const clearCart = async (userId: string): Promise<void> => {
  await pool.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);
};
