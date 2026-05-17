import { pool } from "./pool.js";
import { seedProducts } from "./seeds/products.js";

const run = async (): Promise<void> => {
  for (const p of seedProducts) {
    await pool.query(
      `INSERT INTO products (slug, name, description, image_url, unit_price_cents, category, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       ON CONFLICT (slug) DO UPDATE
       SET name = EXCLUDED.name,
           description = EXCLUDED.description,
           image_url = EXCLUDED.image_url,
           unit_price_cents = EXCLUDED.unit_price_cents,
           category = EXCLUDED.category,
           is_active = true`,
      [p.slug, p.name, p.description, p.imageUrl, p.unitPriceCents, p.category]
    );
  }
  await pool.end();
  console.log("Seed complete");
};

run().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
