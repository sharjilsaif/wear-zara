import { fail, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

/** POST { number, email } — public order status lookup. Both must match; no address is returned. */
export async function POST(request) {
  const limited = await rateLimit("track", { limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  const body = await readJson(request);
  const number = String(body?.number ?? "").trim().toUpperCase();
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!number || !email) return fail("trackNotFound", 404);

  const order = await prisma.order.findFirst({
    where: { number, email: { equals: email, mode: "insensitive" } },
    select: { number: true, status: true, createdAt: true, total: true, city: true, items: { select: { name: true, imageUrl: true, quantity: true } } },
  });
  if (!order) return fail("trackNotFound", 404);
  return Response.json({ order });
}
