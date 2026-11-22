import "server-only";

import { getI18n } from "@/i18n/server";
import { isAdminEmail } from "@/lib/admin";
import { avatarUrl } from "@/lib/avatar";

/** i18n for an admin page (access is already enforced by the admin layout). */
export async function getAdminContext(params) {
  const i18n = await getI18n((await params).lang);

  /** Adds the profile-picture URL and admin flag to a user record. */
  const person = (record) => ({ ...record, image: avatarUrl(record.id, record.avatar), isAdmin: isAdminEmail(record.email) });

  return { ...i18n, person };
}
