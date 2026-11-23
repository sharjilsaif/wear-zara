// Phone-sized checks: the menu works and no page scrolls sideways.
import { expect, test } from "@playwright/test";

import { E2E } from "./constants.mjs";

test("mobile menu navigates", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("link", { name: "Shop", exact: true }).last().click();
  await expect(page).toHaveURL(/\/shop/);
});

for (const path of ["/", "/shop", `/product/${E2E.products.stocked}`, "/cart", "/login", "/signup", "/contact", "/about", "/faq", "/track-order"]) {
  test(`no horizontal scroll on ${path}`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
