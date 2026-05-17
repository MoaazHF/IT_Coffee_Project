import { pool } from "../db/pool.js";
import type { Product } from "../types/domain.js";

const toProduct = (row: any): Product => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  description: row.description,
  imageUrl: row.image_url,
  unitPriceCents: row.unit_price_cents,
  category: row.category,
  isActive: row.is_active
});

export const listProducts = async (): Promise<Product[]> => {
  const { rows } = await pool.query(
    `SELECT * FROM products WHERE is_active = true ORDER BY category, name`
  );
  return rows.map(toProduct);
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const { rows } = await pool.query(
    `SELECT * FROM products WHERE slug = $1 AND is_active = true LIMIT 1`,
    [slug]
  );
  return rows[0] ? toProduct(rows[0]) : null;
};

export const getProductsByIds = async (ids: string[]): Promise<Product[]> => {
  if (ids.length === 0) return [];
  const { rows } = await pool.query(`SELECT * FROM products WHERE id = ANY($1::uuid[])`, [ids]);
  return rows.map(toProduct);
};
