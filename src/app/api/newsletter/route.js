import { fail, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { validateEmail } from "@/lib/validation";

export async function POST(request) {
  const limited = await rateLimit("newsletter", { limit: 5, windowMs: 10 * 60_000 });
  if (limited) return limited;
  const body = await readJson(request);
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (validateEmail(email)) return fail("validation", 422, { fields: { email: "email" } });

  try {
    await prisma.newsletterSubscriber.create({ data: { email } });
    return Response.json({ subscribed: true }, { status: 201 });
  } catch (error) {
    if (error?.code === "P2002") return Response.json({ subscribed: true, existing: true });
    console.error("Newsletter signup failed:", error);
    return fail("server", 500);
  }
}
