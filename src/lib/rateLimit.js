import "server-only";

import { headers } from "next/headers";

/*
 * Small sliding-window rate limiter for abuse-prone endpoints (sign-up, sign-in, forms).
 * In-memory, so each server instance counts separately — enough to stop scripted abuse
 * of a single instance. For multi-region production, swap the Map for Redis/Upstash.
 */
const hits = new Map();

export async function clientIp() {
  const list = await headers();
  return list.get("x-forwarded-for")?.split(",")[0].trim() || list.get("x-real-ip") || "local";
}

const recent = (key, windowMs) => (hits.get(key) ?? []).filter((time) => Date.now() - time < windowMs);

/** Records one hit for `key` and returns how many it has had within `windowMs`. */
export function recordHit(key, windowMs) {
  const list = [...recent(key, windowMs), Date.now()];
  hits.set(key, list);
  if (hits.size > 5000) for (const [entry] of hits) if (recent(entry, windowMs).length === 0) hits.delete(entry);
  return list.length;
}

export const hitCount = (key, windowMs) => recent(key, windowMs).length;

/** Records a hit and returns true when `key` exceeded `limit` calls in the last `windowMs`. */
export const isRateLimited = (key, limit, windowMs) => recordHit(key, windowMs) > limit;

/** For route handlers: a 429 response when the caller exceeded the limit, otherwise null. */
export async function rateLimit(name, { limit = 10, windowMs = 60_000 } = {}) {
  const key = `${name}:${await clientIp()}`;
  return isRateLimited(key, limit, windowMs) ? Response.json({ error: "tooManyRequests" }, { status: 429 }) : null;
}
