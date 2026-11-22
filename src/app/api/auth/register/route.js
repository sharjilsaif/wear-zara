import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import { validateSignup } from "@/lib/validation";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(body?.name ?? "");
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  const errors = validateSignup({ name, email, password });
  if (Object.keys(errors).length > 0) {
    return Response.json({ error: "Please fix the highlighted fields.", errors }, { status: 422 });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      return Response.json(
        { error: "An account with this email already exists.", errors: { email: "This email is already registered." } },
        { status: 409 },
      );
    }

    const user = await prisma.user.create({
      data: { name: name.trim(), email, password: await bcrypt.hash(password, 12) },
      select: { id: true, name: true, email: true },
    });

    return Response.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Register failed:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
