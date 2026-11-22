import { auth } from "@/auth";
import { fail, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { validateContact } from "@/lib/validation";

/** Saves a contact-form message for the admin inbox. */
export async function POST(request) {
  const limited = await rateLimit("contact", { limit: 5, windowMs: 10 * 60_000 });
  if (limited) return limited;
  const body = await readJson(request);
  if (!body) return fail("badRequest");

  const data = {
    name: String(body.name ?? "").trim(),
    email: String(body.email ?? "").trim().toLowerCase(),
    phone: String(body.phone ?? "").trim() || null,
    message: String(body.message ?? "").trim(),
  };
  const fields = validateContact(data);
  if (Object.keys(fields).length > 0) return fail("validation", 422, { fields });

  const session = await auth();
  const userId = session?.user?.id ?? null;

  try {
    // Link the message to the account when it still exists.
    const linked = userId ? await prisma.user.count({ where: { id: userId } }) : 0;
    await prisma.contactMessage.create({ data: { ...data, userId: linked ? userId : null } });
    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Contact message failed:", error);
    return fail("server", 500);
  }
}
