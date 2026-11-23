/** Public URL of a user's profile picture (cache-busted by its update time), or null. */
export function avatarUrl(userId, avatar) {
  if (!userId || !avatar?.updatedAt) return null;
  return `/api/avatar/${userId}?v=${new Date(avatar.updatedAt).getTime()}`;
}

export const AVATAR_TYPES = ["image/webp", "image/jpeg", "image/png"];

/** The real image type from the file's first bytes (null if it isn't a JPEG/PNG/WebP) — never trust the header. */
export function sniffImageType(bytes) {
  const ascii = (start, end) => String.fromCharCode(...bytes.subarray(start, end));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && ascii(1, 4) === "PNG") return "image/png";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  return null;
}
export const AVATAR_MAX_BYTES = 400 * 1024;
