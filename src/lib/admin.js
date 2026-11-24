import "server-only";

/** Admins are configured with a comma-separated ADMIN_EMAILS env var (stored lowercase). */
export function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email) {
  return Boolean(email) && adminEmails().includes(email.toLowerCase());
}
