/** Public URL of a user's profile picture (cache-busted by its update time), or null. */
export function avatarUrl(userId, avatar) {
  if (!userId || !avatar?.updatedAt) return null;
  return `/api/avatar/${userId}?v=${new Date(avatar.updatedAt).getTime()}`;
}

export const AVATAR_TYPES = ["image/webp", "image/jpeg", "image/png"];
export const AVATAR_MAX_BYTES = 400 * 1024;
