import { fail, readJson, requireCustomer } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { setCartQuantity } from "@/lib/userLists";

/** PUT { productId, quantity } — sets the quantity (0 removes the item). */
export async function PUT(request) {
  const { user, response } = await requireCustomer();
  if (response) return response;

  const body = await readJson(request);
  const productId = typeof body?.productId === "string" ? body.productId : null;
  const quantity = Number(body?.quantity);
  if (!productId || !Number.isFinite(quantity)) return fail("badRequest");

  try {
    await setCartQuantity(user.id, productId, quantity);
    return Response.json({ success: true });
  } catch (error) {
    if (error?.code === "P2003") return fail("productUnavailable", 404);
    console.error("Update cart failed:", error);
    return fail("server", 500);
  }
}

/** Empties the cart. */
export async function DELETE() {
  const { user, response } = await requireCustomer();
  if (response) return response;

  await prisma.cartItem.deleteMany({ where: { userId: user.id } });
  return Response.json({ success: true });
}
