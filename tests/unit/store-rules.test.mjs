import assert from "node:assert/strict";
import { test } from "node:test";

import { sniffImageType } from "@/lib/avatar";
import { couponDiscount, couponProblem, getCartTotals } from "@/lib/pricing";
import { validateProductInput } from "@/lib/productInput";
import { safeRedirect } from "@/lib/safeRedirect";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/site";
import { validateCheckout, validatePassword } from "@/lib/validation";

test("cart totals: shipping fee below the threshold, free at/above it", () => {
  const below = getCartTotals([{ price: 10, qty: 2 }], null);
  assert.deepEqual([below.subtotal, below.shipping, below.total, below.itemCount], [20, SHIPPING_FEE, Math.round((20 + SHIPPING_FEE) * 100) / 100, 2]);

  const at = getCartTotals([{ price: FREE_SHIPPING_THRESHOLD, qty: 1 }], null);
  assert.equal(at.shipping, 0);
  assert.equal(getCartTotals([], null).shipping, 0, "empty cart has no shipping");
});

test("cart totals: float money is rounded to cents", () => {
  const totals = getCartTotals([{ price: 0.1, qty: 3 }], null);
  assert.equal(totals.subtotal, 0.3);
});

test("coupons: percent and fixed discounts never exceed the subtotal", () => {
  assert.equal(couponDiscount({ type: "PERCENT", value: 10 }, 59.99), 6);
  assert.equal(couponDiscount({ type: "FIXED", value: 500 }, 40), 40);
  const totals = getCartTotals([{ price: 40, qty: 1 }], { type: "FIXED", value: 500, minSubtotal: 0 });
  assert.equal(totals.total, SHIPPING_FEE, "only shipping is left to pay");
});

test("coupons: minimum spend is pending, not applied", () => {
  const totals = getCartTotals([{ price: 10, qty: 1 }], { type: "PERCENT", value: 50, minSubtotal: 100 });
  assert.equal(totals.discount, 0);
  assert.equal(totals.couponPending, true);
});

test("coupons: every rejection reason", () => {
  const ok = { active: true, expiresAt: null, maxUses: null, usedCount: 0, minSubtotal: 0 };
  assert.equal(couponProblem(ok, 10), null);
  assert.equal(couponProblem(null, 10), "invalid");
  assert.equal(couponProblem({ ...ok, active: false }, 10), "invalid");
  assert.equal(couponProblem({ ...ok, expiresAt: "2000-01-01" }, 10), "expired");
  assert.equal(couponProblem({ ...ok, maxUses: 3, usedCount: 3 }, 10), "usedUp");
  assert.equal(couponProblem({ ...ok, minSubtotal: 50 }, 10), "minSubtotal");
});

test("checkout validation rejects bad contact details", () => {
  const good = { name: "Sara Khan", street: "12 Mall Road", city: "Lahore", phone: "+92 300 1234567", email: "sara@example.com" };
  assert.deepEqual(validateCheckout(good), {});
  assert.deepEqual(Object.keys(validateCheckout({ ...good, email: "nope", phone: "abc" })).sort(), ["email", "phone"]);
  assert.equal(validatePassword("short1"), "passwordShort");
  assert.equal(validatePassword("longenoughbutnodigits"), "passwordWeak");
});

test("product input: ratings can't be set by hand; stock and description are validated", () => {
  const base = { name: "Linen Shirt", price: "49.99", imageUrl: "https://images.unsplash.com/x", categoryIds: ["c1"] };

  const { data } = validateProductInput({ ...base, rating: 5, reviews: 999 });
  assert.equal("rating" in data, false);
  assert.equal("reviews" in data, false);
  assert.equal(data.stock, null, "empty stock = not tracked");

  assert.equal(validateProductInput({ ...base, stock: "7" }).data.stock, 7);
  assert.equal(validateProductInput({ ...base, stock: "0" }).data.stock, 0);
  for (const stock of ["-1", "2.5", "3abc"]) assert.equal(validateProductInput({ ...base, stock }).fields?.stock, "stock", stock);
  assert.equal(validateProductInput({ ...base, description: "x".repeat(2001) }).fields?.description, "descriptionLong");
  assert.equal(validateProductInput({ ...base, imageUrl: "http://insecure.example/x.jpg" }).fields?.imageUrl, "imageUrl");
});

test("safeRedirect only allows same-site paths", () => {
  assert.equal(safeRedirect("/account/orders"), "/account/orders");
  for (const bad of ["https://evil.example", "//evil.example", "/\\evil.example", "javascript:alert(1)", null]) {
    assert.equal(safeRedirect(bad), "/", String(bad));
  }
});

test("avatar type comes from the file bytes, not the declared type", () => {
  const bytes = (...values) => Uint8Array.from(values);
  const ascii = (text) => [...text].map((char) => char.charCodeAt(0));
  assert.equal(sniffImageType(bytes(0xff, 0xd8, 0xff, 0xe0)), "image/jpeg");
  assert.equal(sniffImageType(bytes(0x89, ...ascii("PNG\r\n"))), "image/png");
  assert.equal(sniffImageType(bytes(...ascii("RIFF"), 0, 0, 0, 0, ...ascii("WEBP"))), "image/webp");
  assert.equal(sniffImageType(bytes(...ascii("<svg onload=alert(1)>"))), null);
  assert.equal(sniffImageType(bytes(...ascii("<html>"))), null);
});
