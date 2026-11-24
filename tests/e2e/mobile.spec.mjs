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

test("admin console on a phone: drawer menu works and nothing scrolls sideways", async ({ page }) => {
  await page.goto("/login");
  await page.locator("main").getByLabel("Email").fill(E2E.admin.email);
  await page.locator("main").getByLabel("Password", { exact: true }).fill(E2E.admin.password);
  await page.locator("main").getByRole("button", { name: "Sign In" }).click();
  await expect(page).not.toHaveURL(/\/login/);

  for (const path of ["/admin", "/admin/orders", "/admin/products", "/admin/users", "/admin/notifications"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
  await page.goto("/admin");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("navigation", { name: "Admin" }).getByRole("link", { name: /^Orders/ }).click();
  await expect(page).toHaveURL(/\/admin\/orders/);
});
