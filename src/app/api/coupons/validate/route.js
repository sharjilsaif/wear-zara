import { fail, readJson } from "@/lib/api";
import { findCoupon, publicCoupon } from "@/lib/coupons";
import { couponProblem } from "@/lib/pricing";
import { rateLimit } from "@/lib/rateLimit";

/** POST { code, subtotal } — checks a coupon before it's applied in the cart. */
export async function POST(request) {
  const limited = await rateLimit("coupon", { limit: 20, windowMs: 60_000 });
  if (limited) return limited;
  const body = await readJson(request);
  const coupon = await findCoupon(body?.code);
  const subtotal = Number(body?.subtotal) || 0;

  const problem = couponProblem(coupon, subtotal);
  // A minimum-spend coupon can still be applied; the cart shows how much more is needed.
  if (problem && problem !== "minSubtotal") return fail("coupon", 422, { reason: problem });

  return Response.json({ coupon: publicCoupon(coupon) });
}
