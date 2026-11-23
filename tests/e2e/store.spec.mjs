// End-to-end customer, security and admin journeys. Runs against the throwaway database from server.mjs.
import { expect, request as apiRequest, test } from "@playwright/test";

import { E2E } from "./constants.mjs";

test.describe.configure({ mode: "serial" });

const { lastUnit, soldOut, stocked } = E2E.products;
const runId = Date.now().toString(36);
const customer = { name: "Test Shopper", email: `shopper-${runId}@e2e.test`, password: "Shopper123" };
const other = { name: "Other Shopper", email: `other-${runId}@e2e.test`, password: "Shopper123" };
const address = { street: "12 Test Street", city: "Lahore", phone: "+92 300 1234567" };
let orderNumber;

const main = (page) => page.locator("main");

async function signUp(page, user) {
  await page.goto("/signup");
  await main(page).getByLabel("Name").fill(user.name);
  await main(page).getByLabel("Email").fill(user.email);
  await main(page).getByLabel("Password", { exact: true }).fill(user.password);
  await main(page).getByRole("button", { name: "Create Account" }).click();
  await expect(page).not.toHaveURL(/\/signup/);
}

async function signIn(page, user, to = "/login") {
  await page.goto(to);
  await main(page).getByLabel("Email").fill(user.email);
  await main(page).getByLabel("Password", { exact: true }).fill(user.password);
  await main(page).getByRole("button", { name: "Sign In" }).click();
}

async function signOut(page) {
  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("menuitem", { name: "Sign Out" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Sign Out" }).click();
  await expect(page.getByRole("link", { name: "Sign In" }).first()).toBeVisible();
}

const order = (page, items, extra = {}) =>
  page.request.post("/api/orders", { data: { name: customer.name, email: customer.email, ...address, items, ...extra } });

test("browse: home, search, filters, sorting and pagination match the database", async ({ page, request }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();

  await page.getByPlaceholder("Search products").first().fill("hoodie");
  await page.getByPlaceholder("Search products").first().press("Enter");
  await expect(page).toHaveURL(/q=hoodie/);
  await expect(main(page).getByRole("link", { name: /stocked hoodie/i }).first()).toBeVisible();

  await page.goto("/shop?q=zzzz-no-such-thing");
  await expect(page.getByText("No products found")).toBeVisible();

  // The count shown for a category is the database count.
  const mens = await (await request.get("/api/products?category=mens-fashion&limit=50")).json();
  await page.goto("/shop?category=mens-fashion");
  await expect(main(page).getByText(`${mens.total} products`).first()).toBeVisible();

  const asc = await (await request.get("/api/products?sort=price-asc&limit=50")).json();
  const prices = asc.products.map((product) => product.price);
  expect(prices).toEqual([...prices].sort((a, b) => a - b));

  const [page1, page2] = await Promise.all([1, 2].map(async (n) => (await request.get(`/api/products?page=${n}`)).json()));
  const ids1 = new Set(page1.products.map((product) => product.id));
  expect(page2.products.some((product) => ids1.has(product.id))).toBe(false);
  expect(page1.total).toBe(page2.total);

  await page.goto("/shop?page=2");
  await expect(main(page).getByRole("heading", { level: 3 }).first()).toContainText(new RegExp(page2.products[0].name.split(" ")[0], "i"));

  expect(errors).toEqual([]);
});

test("missing pages return 404 and fabricated content is gone", async ({ page }) => {
  for (const path of ["/product/does-not-exist", "/careers", "/no/such/page"]) {
    const response = await page.goto(path);
    expect(response.status(), path).toBe(404);
    await expect(page.getByText("Page not found")).toBeVisible();
  }
  await page.goto("/about");
  await expect(page.getByText("Meet the Team")).toHaveCount(0);
  await expect(page.getByText("45.5K")).toHaveCount(0);
  await page.goto("/contact");
  await expect(page.getByText("Baker Street")).toHaveCount(0);
});

test("product page: stock states and honest structured data", async ({ page }) => {
  await page.goto(`/product/${soldOut}`);
  await expect(main(page).getByText("Out of stock").first()).toBeVisible();
  await expect(main(page).getByRole("button", { name: "Buy Now" })).toBeDisabled();
  const jsonLd = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(jsonLd.offers.availability).toBe("https://schema.org/OutOfStock");
  expect(jsonLd.aggregateRating).toBeUndefined(); // no real reviews, so no rating is published

  await page.goto(`/product/${stocked}`);
  await expect(main(page).getByText("Only 5 left")).toBeVisible();
  // No invented "quality materials" copy when the product has no description.
  await expect(page.getByText("quality materials")).toHaveCount(0);
});

test("cart: totals, quantity limits, coupon rules and persistence", async ({ page }) => {
  await page.goto(`/product/${stocked}`);
  await main(page).getByRole("button", { name: "Add to Bag" }).first().click();
  await page.goto("/cart");
  const summary = main(page);
  await expect(summary.getByText("$69.99").first()).toBeVisible(); // 60 + 9.99 shipping

  const increase = main(page).getByRole("button", { name: "Increase quantity" });
  for (let qty = 2; qty <= 5; qty += 1) await increase.click();
  await expect(increase).toBeDisabled(); // capped at the 5 in stock
  await expect(summary.getByText("$300.00").first()).toBeVisible(); // free shipping over the threshold

  const code = summary.getByPlaceholder(/Enter a code/);
  for (const [value, message] of [
    ["NOPE", "This code isn't valid."],
    ["OLD5", "This code has expired."],
  ]) {
    await code.fill(value);
    await summary.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByText(message).first()).toBeVisible();
  }
  await code.fill("TEST10");
  await summary.getByRole("button", { name: "Apply" }).click();
  await expect(summary.getByText("$270.00").first()).toBeVisible();

  await page.reload();
  await expect(main(page).getByText(/stocked hoodie/i).first()).toBeVisible();

  await main(page).getByRole("button", { name: /Remove E2e Stocked Hoodie/i }).click();
  await expect(page.getByText("Your bag is empty")).toBeVisible();
});

test("auth: protected pages, sign-up, sign-out, wrong password, no admin for customers", async ({ page }) => {
  await page.goto("/account");
  await expect(page).toHaveURL(/\/login/);
  await page.goto("/checkout");
  await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fcheckout|\/login\?callbackUrl=\/checkout/);

  await signUp(page, customer);
  await signOut(page);

  await signIn(page, { ...customer, password: "WrongPass999" });
  await expect(page.getByText("Incorrect email or password.")).toBeVisible();

  await signIn(page, customer);
  await expect(page).not.toHaveURL(/\/login/);
  await page.goto("/admin");
  await expect(page).not.toHaveURL(/\/admin/);
});

test("checkout: COD order, confirmation, history, tracking; cancelling restores stock", async ({ page }) => {
  await signIn(page, customer);
  await expect(page).not.toHaveURL(/\/login/);

  await page.goto(`/product/${stocked}`);
  await main(page).getByRole("button", { name: "Increase quantity" }).click();
  await main(page).getByRole("button", { name: "Add to Bag" }).first().click();
  await page.goto("/checkout");
  for (const [label, value] of [["Street address", address.street], ["Town / City", address.city], ["Phone", address.phone]]) {
    await main(page).getByLabel(label).fill(value);
  }
  // Double-click must still create a single order.
  await main(page).getByRole("button", { name: /Place Order/ }).dblclick();
  await expect(page).toHaveURL(/\/checkout\/success\?order=WZ-/);
  orderNumber = new URL(page.url()).searchParams.get("order");

  await page.goto(`/product/${stocked}`);
  await expect(main(page).getByText("Only 3 left")).toBeVisible();

  await page.goto("/account/orders");
  await expect(main(page).getByText(orderNumber)).toHaveCount(1);

  await page.goto("/track-order");
  await main(page).getByLabel("Order number").fill(orderNumber);
  await main(page).getByLabel("Email").fill(customer.email);
  await main(page).getByRole("button", { name: "Track" }).click();
  await expect(main(page).getByText("Placed").first()).toBeVisible();

  await page.goto(`/account/orders/${orderNumber}`);
  await main(page).getByRole("button", { name: "Cancel Order" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Cancel Order" }).click();
  await expect(main(page).getByText("This order was cancelled.")).toBeVisible();

  await page.goto(`/product/${stocked}`);
  await expect(main(page).getByText("Only 5 left")).toBeVisible();
});

test("security: prices, ownership, roles and origins are enforced on the server", async ({ page, browser }) => {
  await signIn(page, customer);
  await expect(page).not.toHaveURL(/\/login/);

  // Browser-sent prices and totals are ignored.
  const placed = await order(page, [{ productId: stocked, quantity: 1, price: 0.01 }], { total: 0.01, subtotal: 0.01, shipping: 0 });
  expect(placed.status()).toBe(201);
  const { order: created } = await placed.json();
  const tracked = await (await page.request.post("/api/orders/track", { data: { number: created.number, email: customer.email } })).json();
  expect(tracked.order.total).toBe(69.99);

  expect((await order(page, [{ productId: lastUnit, quantity: 2 }])).status()).toBe(409); // more than in stock
  expect((await order(page, [{ productId: "no-such-product", quantity: 1 }])).status()).toBe(409);

  // Customers can't change order status, catalogue or coupons.
  expect((await page.request.patch(`/api/orders/${created.number}`, { data: { status: "DELIVERED" } })).status()).toBe(403);
  expect((await page.request.post("/api/products", { data: { name: "Hack", price: 1 } })).status()).toBe(403);
  expect((await page.request.post("/api/admin/coupons", { data: { code: "FREE100", value: 100 } })).status()).toBe(403);

  // An account with an order on its way can't be deleted (that would delete the order).
  const deletion = await page.request.delete("/api/account");
  expect(deletion.status()).toBe(409);
  expect((await deletion.json()).error).toBe("openOrders");

  // Cross-site and opaque origins are refused; a missing session is a 401.
  const anon = await apiRequest.newContext({ baseURL: "http://localhost:3100" });
  expect((await anon.post("/api/orders", { data: { items: [] } })).status()).toBe(401);
  for (const origin of ["https://evil.example", "null"]) {
    expect((await anon.post("/api/newsletter", { headers: { Origin: origin }, data: { email: "x@e2e.test" } })).status(), origin).toBe(403);
  }
  await anon.dispose();

  // Another customer can't see or cancel this order.
  const otherContext = await browser.newContext();
  const otherPage = await otherContext.newPage();
  await signUp(otherPage, other);
  // (Status is 200 because the account section streams a loading state first; the content is what matters.)
  await otherPage.goto(`/account/orders/${created.number}`);
  await expect(otherPage.getByText("Page not found")).toBeVisible();
  await expect(otherPage.getByText(address.street)).toHaveCount(0);
  await expect(otherPage.getByText(customer.email)).toHaveCount(0);
  expect((await otherPage.request.patch(`/api/orders/${created.number}`, { data: { action: "cancel" } })).status()).toBe(404);
  await otherContext.close();
});

test("stock: concurrent checkouts can't sell the last unit twice", async ({ page }) => {
  await signIn(page, customer);
  await expect(page).not.toHaveURL(/\/login/);

  const results = await Promise.all([1, 2, 3].map(() => order(page, [{ productId: lastUnit, quantity: 1 }])));
  const statuses = results.map((response) => response.status()).sort();
  expect(statuses.filter((status) => status === 201)).toHaveLength(1);
  for (const response of results.filter((r) => r.status() !== 201)) expect((await response.json()).error).toBe("outOfStock");

  await page.goto(`/product/${lastUnit}`);
  await expect(main(page).getByText("Out of stock").first()).toBeVisible();
});

test("reviews drive the rating; disguised avatar uploads are refused", async ({ page }) => {
  await signIn(page, customer);
  await expect(page).not.toHaveURL(/\/login/);

  const review = (rating) => page.request.post("/api/reviews", { data: { productId: stocked, rating, body: "Fits well and the fabric feels good." } });
  expect((await review(4)).status()).toBe(201);
  expect((await review(5)).status()).toBe(409); // one review per customer
  const product = await (await page.request.get(`/api/products/${stocked}`)).json();
  expect([product.rating, product.reviews]).toEqual([4, 1]);

  await page.goto(`/product/${stocked}`);
  const jsonLd = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(jsonLd.aggregateRating).toEqual({ "@type": "AggregateRating", ratingValue: 4, reviewCount: 1 });

  const fake = await page.request.put("/api/account/avatar", { headers: { "Content-Type": "image/png" }, data: Buffer.from("<svg onload=alert(1)>") });
  expect(fake.status()).toBe(415);
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
  expect((await page.request.put("/api/account/avatar", { headers: { "Content-Type": "image/webp" }, data: png })).status()).toBe(200);
});

test("admin: product with stock and description, order status rules, coupons", async ({ page }) => {
  await signIn(page, E2E.admin);
  await expect(page).not.toHaveURL(/\/login/);

  await page.goto("/admin/products/new");
  const name = `E2E Linen Shirt ${runId}`;
  await main(page).getByLabel(/^Product name/).fill(name);
  await main(page).getByLabel(/^Price \(USD\)/).fill("49.99");
  await main(page).getByLabel(/^Image URL/).fill("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab");
  await main(page).getByLabel("Stock", { exact: true }).fill("3");
  await main(page).getByLabel("Description", { exact: true }).fill("100% linen. Relaxed fit. Machine wash cold.");
  await main(page).getByText("Men's Fashion", { exact: true }).click();
  await main(page).getByRole("button", { name: "Publish Product" }).click();
  await expect(page).toHaveURL(/\/admin\/products$/);

  const found = await (await page.request.get(`/api/products?q=${encodeURIComponent(name)}`)).json();
  expect(found.total).toBe(1);
  await page.goto(`/product/${found.products[0].id}`);
  await expect(main(page).getByText("100% linen. Relaxed fit. Machine wash cold.")).toBeVisible();
  await expect(main(page).getByText("Only 3 left")).toBeVisible();

  // Admins move orders through their lifecycle, but a cancelled order stays cancelled.
  expect((await page.request.patch(`/api/orders/${orderNumber}`, { data: { status: "PROCESSING" } })).status()).toBe(409);
  const open = await (await page.request.get("/admin/orders")).text();
  expect(open).toContain(orderNumber);

  const coupon = await page.request.post("/api/admin/coupons", { data: { code: `E2E${runId}`.slice(0, 20).toUpperCase(), type: "FIXED", value: 5 } });
  expect(coupon.status()).toBe(201);
});
