import "server-only";

import { auth } from "@/auth";

/**
 * Guard for admin-only API routes.
 * Returns `null` when allowed, otherwise a ready-to-return error Response.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Please log in to continue." }, { status: 401 });
  }
  if (!session.user.isAdmin) {
    return Response.json({ error: "This demo is read-only. Only store admins can make changes." }, { status: 403 });
  }
  return null;
}
