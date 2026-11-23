import { fail, readJson, requireUser, revalidateStore } from "@/lib/api";
import { refreshRating } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

/** POST { productId, rating, title?, body } — one review per customer per product. */
export async function POST(request) {
  const { user, response } = await requireUser();
  if (response) return response;
  const limited = await rateLimit("review", { limit: 5, windowMs: 10 * 60_000 });
  if (limited) return limited;

  const input = await readJson(request);
  const productId = typeof input?.productId === "string" ? input.productId : "";
  const rating = Math.floor(Number(input?.rating));
  const title = String(input?.title ?? "").trim().slice(0, 80) || null;
  const body = String(input?.body ?? "").trim();

  const fields = {};
  if (!(rating >= 1 && rating <= 5)) fields.rating = "rating";
  if (body.length < 10) fields.body = "messageShort";
  else if (body.length > 1000) fields.body = "reviewLong";
  if (!productId) return fail("badRequest");
  if (Object.keys(fields).length) return fail("validation", 422, { fields });

  try {
    if (!(await prisma.product.count({ where: { id: productId } }))) return fail("productUnavailable", 404);
    await prisma.review.create({ data: { productId, userId: user.id, rating, title, body } });
    await refreshRating(productId);
    revalidateStore();
    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error?.code === "P2002") return fail("alreadyReviewed", 409);
    if (error?.code === "P2003") return fail("unauthorized", 401);
    console.error("Create review failed:", error);
    return fail("server", 500);
  }
}
