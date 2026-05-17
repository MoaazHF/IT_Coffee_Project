import { test, expect } from "@playwright/test";

test("shop page renders", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.getByRole("heading", { name: "Shop" })).toBeVisible();
});
