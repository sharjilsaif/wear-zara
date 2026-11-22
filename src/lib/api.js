import "server-only";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

/** Error responses carry a code the client translates (`errors.<code>`). */
export function fail(error, status = 400, extra) {
  return Response.json({ error, ...extra }, { status });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

/** `{ user }` for a signed-in request, otherwise `{ response }` with a 401. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) return { response: fail("unauthorized", 401) };
  return { user: session.user };
}

/** `{ user }` for an admin, otherwise `{ response }` with a 401 / 403. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return { response: fail("unauthorized", 401) };
  if (!session.user.isAdmin) return { response: fail("forbidden", 403) };
  return { user: session.user };
}

/** Refreshes every cached storefront page (all languages) after catalogue edits. */
export function revalidateStore() {
  revalidatePath("/[lang]", "layout");
}
