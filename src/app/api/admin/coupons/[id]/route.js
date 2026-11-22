import { fail, readJson, requireAdmin } from "@/lib/api";
import { parseCoupon } from "@/lib/coupons";
import { prisma } from "@/lib/prisma";

/** PATCH { active } toggles a coupon; a full form body edits it. */
export async function PATCH(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await readJson(request);
  let data = { active: Boolean(body?.active) };

  if (body?.code !== undefined) {
    const parsed = parseCoupon(body);
    if (parsed.fields) return fail("validation", 422, { fields: parsed.fields });
    data = parsed.data;
  }

  try {
    return Response.json({ coupon: await prisma.coupon.update({ where: { id }, data }) });
  } catch (error) {
    if (error?.code === "P2025") return fail("notFound", 404);
    if (error?.code === "P2002") return fail("validation", 422, { fields: { code: "couponExists" } });
    console.error("Update coupon failed:", error);
    return fail("server", 500);
  }
}

export async function DELETE(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  await prisma.coupon.deleteMany({ where: { id } });
  return Response.json({ success: true });
}
