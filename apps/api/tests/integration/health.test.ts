import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app.js";

const runDbTests = process.env.RUN_DB_TESTS === "1";
const describeDb = runDbTests ? describe : describe.skip;

describeDb("health endpoint", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
