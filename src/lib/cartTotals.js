import { COUPONS, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/site";

/** Shared by the cart and checkout pages so totals can never disagree. */
export function getCartTotals(items, couponCode) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const coupon = couponCode ? COUPONS[couponCode] : null;
  const discount = coupon ? (subtotal * coupon.percent) / 100 : 0;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount + shipping);
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  return { subtotal, discount, shipping, total, itemCount, coupon };
}
