import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { pool } from "../../src/db/pool.js";
import { app } from "../../src/app.js";

const runDbTests = process.env.RUN_DB_TESTS === "1";
const describeDb = runDbTests ? describe : describe.skip;

describeDb("auth/cart/checkout flow", () => {
  let accessToken = "";
  let productId = "";
  let itemId = "";

  beforeAll(async () => {
    await pool.query("DELETE FROM cart_items");
    await pool.query("DELETE FROM refresh_tokens");
    await pool.query("DELETE FROM users");

    const products = await pool.query("SELECT id FROM products ORDER BY name ASC LIMIT 1");
    productId = products.rows[0]?.id;
  });

  it("registers and logs user", async () => {
    const registerRes = await request(app).post("/api/v1/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.accessToken).toBeTruthy();
    accessToken = registerRes.body.accessToken;
  });

  it("adds and updates cart item", async () => {
    const addRes = await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ productId, quantity: 2 });

    expect(addRes.status).toBe(201);
    itemId = addRes.body.data[0].itemId;

    const patchRes = await request(app)
      .patch(`/api/v1/cart/items/${itemId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ quantity: 3 });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data[0].quantity).toBe(3);
  });

  it("creates checkout session", async () => {
    const res = await request(app)
      .post("/api/v1/checkout/session")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("Idempotency-Key", `integration-key-${Date.now()}`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.data.checkoutSessionId).toBeTruthy();
  });
});
