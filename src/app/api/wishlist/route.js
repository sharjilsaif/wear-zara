import { fail, readJson, requireUser } from "@/lib/api";
import { prisma } from "@/lib/prisma";

/** POST { productId } — save a product. */
export async function POST(request) {
  const { user, response } = await requireUser();
  if (response) return response;

  const body = await readJson(request);
  const productId = typeof body?.productId === "string" ? body.productId : null;
  if (!productId) return fail("badRequest");

  try {
    await prisma.wishlistItem.createMany({ data: [{ userId: user.id, productId }], skipDuplicates: true });
    return Response.json({ success: true });
  } catch (error) {
    if (error?.code === "P2003") return fail("productUnavailable", 404);
    console.error("Wishlist add failed:", error);
    return fail("server", 500);
  }
}

/** DELETE ?productId=… removes one product; without it, clears the wishlist. */
export async function DELETE(request) {
  const { user, response } = await requireUser();
  if (response) return response;

  const productId = new URL(request.url).searchParams.get("productId");
  await prisma.wishlistItem.deleteMany({ where: { userId: user.id, ...(productId ? { productId } : {}) } });
  return Response.json({ success: true });
}
