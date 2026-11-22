import { fail, readJson, requireUser } from "@/lib/api";
import { findCoupon, normalizeCode } from "@/lib/coupons";
import { generateOrderNumber } from "@/lib/orders";
import { couponProblem, getCartTotals } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { MAX_QTY } from "@/lib/site";
import { validateCheckout } from "@/lib/validation";

const clean = (value, max = 200) => String(value ?? "").trim().slice(0, max);

class CheckoutError extends Error {
  constructor(code, extra) {
    super(code);
    this.code = code;
    this.extra = extra;
  }
}

/** Places an order: prices and the coupon are re-checked on the server, never trusted from the browser. */
export async function POST(request) {
  const { user, response } = await requireUser();
  if (response) return response;
  const limited = await rateLimit("order", { limit: 10, windowMs: 10 * 60_000 });
  if (limited) return limited;

  const body = await readJson(request);
  if (!body) return fail("badRequest");

  const customer = {
    name: clean(body.name, 60),
    email: clean(body.email, 120).toLowerCase(),
    phone: clean(body.phone, 20),
    company: clean(body.company, 80),
    street: clean(body.street),
    apartment: clean(body.apartment),
    city: clean(body.city, 80),
    notes: clean(body.notes, 500),
  };
  const fields = validateCheckout(customer);
  if (Object.keys(fields).length > 0) return fail("validation", 422, { fields });

  // Merge duplicate lines and clamp quantities.
  const requested = new Map();
  for (const item of Array.isArray(body.items) ? body.items : []) {
    if (typeof item?.productId !== "string") continue;
    const qty = Math.floor(Number(item.quantity) || 0);
    if (qty < 1) continue;
    requested.set(item.productId, Math.min(MAX_QTY, (requested.get(item.productId) ?? 0) + qty));
  }
  if (requested.size === 0 || requested.size > 50) return fail("emptyCart");

  const products = await prisma.product.findMany({
    where: { id: { in: [...requested.keys()] } },
    select: { id: true, name: true, price: true, imageUrl: true },
  });
  const missing = [...requested.keys()].filter((id) => !products.some((product) => product.id === id));
  if (missing.length > 0) return fail("productsUnavailable", 409, { ids: missing });

  const lines = products.map((product) => ({ ...product, qty: requested.get(product.id) }));

  let coupon = null;
  const code = normalizeCode(body.couponCode);
  if (code) {
    coupon = await findCoupon(code);
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
    const problem = couponProblem(coupon, subtotal);
    if (problem) return fail("coupon", 422, { reason: problem });
  }

  const totals = getCartTotals(lines, coupon);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const order = await prisma.$transaction(async (tx) => {
        if (coupon) {
          // Atomically claim one use, respecting maxUses even under concurrent checkouts.
          const claimed = await tx.coupon.updateMany({
            where: {
              id: coupon.id,
              active: true,
              OR: [{ maxUses: null }, { usedCount: { lt: prisma.coupon.fields.maxUses } }],
            },
            data: { usedCount: { increment: 1 } },
          });
          if (claimed.count === 0) throw new CheckoutError("coupon", { reason: "usedUp" });
        }

        const created = await tx.order.create({
          data: {
            number: generateOrderNumber(),
            userId: user.id,
            customerName: customer.name,
            email: customer.email,
            phone: customer.phone,
            company: customer.company || null,
            street: customer.street,
            apartment: customer.apartment || null,
            city: customer.city,
            notes: customer.notes || null,
            paymentMethod: "COD",
            couponCode: coupon?.code ?? null,
            subtotal: totals.subtotal,
            discount: totals.discount,
            shipping: totals.shipping,
            total: totals.total,
            items: {
              create: lines.map((line) => ({
                productId: line.id,
                name: line.name,
                imageUrl: line.imageUrl,
                unitPrice: line.price,
                quantity: line.qty,
              })),
            },
          },
          select: { number: true },
        });

        await tx.cartItem.deleteMany({ where: { userId: user.id, productId: { in: lines.map((line) => line.id) } } });
        await tx.user.updateMany({ where: { id: user.id, phone: null }, data: { phone: customer.phone } });
        return created;
      });

      return Response.json({ order }, { status: 201 });
    } catch (error) {
      if (error instanceof CheckoutError) return fail(error.code, 422, error.extra);
      if (error?.code === "P2002") continue; // order number collision — try a new one
      if (error?.code === "P2003") return fail("unauthorized", 401);
      console.error("Place order failed:", error);
      return fail("server", 500);
    }
  }
  return fail("server", 500);
}
