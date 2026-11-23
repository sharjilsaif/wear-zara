import { auth } from "@/auth";
import { fail, readJson, revalidateProducts } from "@/lib/api";
import { CANCELLABLE } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUSES } from "@/lib/site";

class Conflict extends Error {}

/**
 * PATCH { action: "cancel" } — the customer (or an admin) cancels an order that hasn't shipped.
 * PATCH { status } — admins move an order through its lifecycle. CANCELLED is final.
 */
export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return fail("unauthorized", 401);
  const { isAdmin, id: userId } = session.user;

  const { number } = await params;
  const body = await readJson(request);
  const order = await prisma.order.findUnique({
    where: { number },
    select: { id: true, userId: true, status: true, couponCode: true, items: { select: { productId: true, quantity: true } } },
  });
  if (!order || (!isAdmin && order.userId !== userId)) return fail("notFound", 404);

  let status;
  if (body?.action === "cancel") {
    if (!CANCELLABLE.includes(order.status)) return fail("cannotCancel", 409);
    status = "CANCELLED";
  } else if (ORDER_STATUSES.includes(body?.status)) {
    if (!isAdmin) return fail("forbidden", 403);
    status = body.status;
  } else {
    return fail("badRequest");
  }

  if (status === order.status) return Response.json({ status });
  // Stock and the coupon use were already given back; reopening would double-count them.
  if (order.status === "CANCELLED") return fail("cannotReopen", 409);

  try {
    await prisma.$transaction(async (tx) => {
      // Only moves from the status we read, so a concurrent change (e.g. admin ships while the customer cancels) wins once.
      const moved = await tx.order.updateMany({
        where: { id: order.id, status: order.status },
        data: { status, cancelledAt: status === "CANCELLED" ? new Date() : null },
      });
      if (moved.count === 0) throw new Conflict();
      if (status !== "CANCELLED") return;

      if (order.couponCode) {
        await tx.coupon.updateMany({ where: { code: order.couponCode, usedCount: { gt: 0 } }, data: { usedCount: { decrement: 1 } } });
      }
      // Goods that never left the warehouse go back on the shelf. Returns after shipping are restocked by hand.
      if (CANCELLABLE.includes(order.status)) {
        for (const item of order.items) {
          if (!item.productId) continue;
          await tx.product.updateMany({ where: { id: item.productId, stock: { not: null } }, data: { stock: { increment: item.quantity } } });
        }
      }
    });
  } catch (error) {
    if (error instanceof Conflict) return fail("orderChanged", 409);
    console.error("Update order failed:", error);
    return fail("server", 500);
  }
  if (status === "CANCELLED") revalidateProducts(order.items.map((item) => item.productId).filter(Boolean));
  return Response.json({ status });
}
