import { fail, readJson, requireAdmin } from "@/lib/api";
import { parseCoupon } from "@/lib/coupons";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { data, fields } = parseCoupon(await readJson(request));
  if (fields) return fail("validation", 422, { fields });

  try {
    return Response.json({ coupon: await prisma.coupon.create({ data }) }, { status: 201 });
  } catch (error) {
    if (error?.code === "P2002") return fail("validation", 422, { fields: { code: "couponExists" } });
    console.error("Create coupon failed:", error);
    return fail("server", 500);
  }
}
