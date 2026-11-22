import { fail, readJson, requireUser } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { validateName, validatePhone } from "@/lib/validation";

/** Update the signed-in user's name and phone. */
export async function PATCH(request) {
  const { user, response } = await requireUser();
  if (response) return response;

  const body = await readJson(request);
  if (!body) return fail("badRequest");

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const fields = {};
  const nameError = validateName(name);
  const phoneError = validatePhone(phone, { required: false });
  if (nameError) fields.name = nameError;
  if (phoneError) fields.phone = phoneError;
  if (Object.keys(fields).length > 0) return fail("validation", 422, { fields });

  try {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name, phone: phone || null },
      select: { name: true, phone: true },
    });
    return Response.json({ user: updated });
  } catch (error) {
    if (error?.code === "P2025") return fail("notFound", 404);
    console.error("Update profile failed:", error);
    return fail("server", 500);
  }
}

/** Permanently delete the signed-in user's account (orders are kept, anonymised). */
export async function DELETE() {
  const { user, response } = await requireUser();
  if (response) return response;

  try {
    await prisma.user.delete({ where: { id: user.id } });
    return Response.json({ success: true });
  } catch (error) {
    if (error?.code === "P2025") return fail("notFound", 404);
    console.error("Delete account failed:", error);
    return fail("server", 500);
  }
}
