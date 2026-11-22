import { auth } from "@/auth";
import { fail, revalidateStore } from "@/lib/api";
import { prisma } from "@/lib/prisma";

/** The author or an admin can delete a review; the product's count is adjusted. */
export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return fail("unauthorized", 401);

  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id }, select: { userId: true, productId: true } });
  if (!review) return fail("notFound", 404);
  if (review.userId !== session.user.id && !session.user.isAdmin) return fail("forbidden", 403);

  await prisma.$transaction([
    prisma.review.delete({ where: { id } }),
    prisma.product.updateMany({ where: { id: review.productId, reviews: { gt: 0 } }, data: { reviews: { decrement: 1 } } }),
  ]);
  revalidateStore();
  return Response.json({ success: true });
}
