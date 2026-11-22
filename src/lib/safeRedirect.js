/** Only allow same-site relative paths as post-login destinations (prevents open redirects). */
export function safeRedirect(value, fallback = "/") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
