import { describe, expect, it } from "vitest";
import { calculateTaxCents, calculateTotalCents } from "../../src/utils/money.js";

describe("money utilities", () => {
  it("calculates 5% tax", () => {
    expect(calculateTaxCents(10000)).toBe(500);
  });

  it("calculates total", () => {
    expect(calculateTotalCents(10000)).toBe(10500);
  });
});
