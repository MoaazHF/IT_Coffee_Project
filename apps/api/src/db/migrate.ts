import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./pool.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const run = async (): Promise<void> => {
  const sql = await readFile(join(__dirname, "migrations", "001_init.sql"), "utf8");
  await pool.query(sql);
  await pool.end();
  console.log("Migrations applied");
};

run().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
