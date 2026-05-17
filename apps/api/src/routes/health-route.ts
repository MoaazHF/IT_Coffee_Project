import { Router } from "express";
import { pool } from "../db/pool.js";

export const healthRouter = Router();

healthRouter.get("/health", async (_req, res) => {
  await pool.query("SELECT 1");
  res.setHeader("Cache-Control", "no-store");
  res.json({ ok: true, service: "coffee-api", timestamp: new Date().toISOString() });
});
