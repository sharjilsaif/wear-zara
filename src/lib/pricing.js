import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/site";

/** Money is stored as floats; always round to cents after arithmetic. */
export const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

/**
 * Why a coupon can't be used right now (or null when it can).
 * Codes map to `coupon.errors.*` in the dictionaries.
 */
export function couponProblem(coupon, subtotal, now = Date.now()) {
  if (!coupon || !coupon.active) return "invalid";
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < now) return "expired";
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) return "usedUp";
  if (subtotal < (coupon.minSubtotal ?? 0)) return "minSubtotal";
  return null;
}

export function couponDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  const raw = coupon.type === "FIXED" ? coupon.value : (subtotal * coupon.value) / 100;
  return round2(Math.min(subtotal, Math.max(0, raw)));
}

/**
 * Shared by the cart, checkout and the orders API so totals can never disagree.
 * `items`: [{ price, qty }]. `coupon`: { type, value, minSubtotal } or null.
 */
export function getCartTotals(items, coupon) {
  const subtotal = round2(items.reduce((sum, item) => sum + item.price * item.qty, 0));
  const applies = coupon && subtotal >= (coupon.minSubtotal ?? 0);
  const discount = applies ? couponDiscount(coupon, subtotal) : 0;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = round2(Math.max(0, subtotal - discount + shipping));
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  return { subtotal, discount, shipping, total, itemCount, coupon: applies ? coupon : null, couponPending: Boolean(coupon && !applies) };
}
