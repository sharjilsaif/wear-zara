import bcrypt from "bcrypt";

import { fail, readJson, requireUser } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { validatePassword } from "@/lib/validation";

export async function PUT(request) {
  const { user, response } = await requireUser();
  if (response) return response;

  const body = await readJson(request);
  const current = String(body?.current ?? "");
  const next = String(body?.next ?? "");

  const nextError = validatePassword(next);
  if (nextError) return fail("validation", 422, { fields: { next: nextError } });

  try {
    const record = await prisma.user.findUnique({ where: { id: user.id }, select: { password: true } });
    if (!record) return fail("notFound", 404);
    if (!(await bcrypt.compare(current, record.password))) {
      return fail("validation", 422, { fields: { current: "wrongPassword" } });
    }

    await prisma.user.update({ where: { id: user.id }, data: { password: await bcrypt.hash(next, 12) } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Change password failed:", error);
    return fail("server", 500);
  }
}
