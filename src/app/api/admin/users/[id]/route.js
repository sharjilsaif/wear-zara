import { fail, requireAdmin } from "@/lib/api";
import { isAdminEmail } from "@/lib/admin";
import { hasOpenOrders } from "@/lib/orders";
import { prisma } from "@/lib/prisma";

/** Deletes a customer account. Admin accounts can't be deleted from here. */
export async function DELETE(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id }, select: { email: true } });
  if (!user) return fail("notFound", 404);
  if (isAdminEmail(user.email)) return fail("cannotDeleteAdmin", 409);
  if (await hasOpenOrders(id)) return fail("openOrders", 409);

  await prisma.user.delete({ where: { id } });
  return Response.json({ success: true });
}
