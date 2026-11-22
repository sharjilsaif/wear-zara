import { auth } from "@/auth";
import { fail, readJson } from "@/lib/api";
import { CANCELLABLE } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUSES } from "@/lib/site";

/**
 * PATCH { action: "cancel" } — the customer (or an admin) cancels an order that hasn't shipped.
 * PATCH { status } — admins move an order through its lifecycle.
 */
export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return fail("unauthorized", 401);
  const { isAdmin, id: userId } = session.user;

  const { number } = await params;
  const body = await readJson(request);
  const order = await prisma.order.findUnique({
    where: { number },
    select: { id: true, userId: true, status: true, couponCode: true },
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

  const updates = [
    prisma.order.update({
      where: { id: order.id },
      data: { status, cancelledAt: status === "CANCELLED" ? new Date() : null },
    }),
  ];

  // Cancelling gives the coupon use back; re-opening a cancelled order claims it again.
  if (order.couponCode && status === "CANCELLED") {
    updates.push(
      prisma.coupon.updateMany({ where: { code: order.couponCode, usedCount: { gt: 0 } }, data: { usedCount: { decrement: 1 } } }),
    );
  } else if (order.couponCode && order.status === "CANCELLED") {
    updates.push(prisma.coupon.updateMany({ where: { code: order.couponCode }, data: { usedCount: { increment: 1 } } }));
  }

  await prisma.$transaction(updates);
  return Response.json({ status });
}
