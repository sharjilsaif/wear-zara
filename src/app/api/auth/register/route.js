import bcrypt from "bcrypt";

import { fail, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { validateSignup } from "@/lib/validation";

export async function POST(request) {
  const limited = await rateLimit("register", { limit: 5, windowMs: 10 * 60_000 });
  if (limited) return limited;
  const body = await readJson(request);
  if (!body) return fail("badRequest");

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  const errors = validateSignup({ name, email, password });
  if (Object.keys(errors).length > 0) return fail("validation", 422, { fields: errors });

  try {
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) return fail("emailTaken", 409, { fields: { email: "emailTaken" } });

    const user = await prisma.user.create({
      data: { name, email, password: await bcrypt.hash(password, 12) },
      select: { id: true, name: true, email: true },
    });
    return Response.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Register failed:", error);
    return fail("server", 500);
  }
}
