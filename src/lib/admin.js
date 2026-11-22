import "server-only";

/** Admins are configured with a comma-separated ADMIN_EMAILS env var. */
export function isAdminEmail(email) {
  if (!email) return false;

  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return admins.includes(email.toLowerCase());
}
