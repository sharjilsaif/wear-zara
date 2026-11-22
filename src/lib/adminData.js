import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getI18n } from "@/i18n/server";
import { isAdminEmail } from "@/lib/admin";
import { avatarUrl } from "@/lib/avatar";

/**
 * i18n for an admin page. Checks admin access itself: the layout's check alone is not enough,
 * because pages render in parallel with their layout and could stream data before its redirect.
 */
export async function getAdminContext(params) {
  const [i18n, session] = await Promise.all([getI18n((await params).lang), auth()]);
  if (!session?.user?.isAdmin) redirect("/");

  /** Adds the profile-picture URL and admin flag to a user record. */
  const person = (record) => ({ ...record, image: avatarUrl(record.id, record.avatar), isAdmin: isAdminEmail(record.email) });

  return { ...i18n, person };
}
