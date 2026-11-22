"use client";

import { useSyncExternalStore } from "react";

// One shared 1-second clock for every countdown on the page.
const subscribe = (listener) => {
  const id = setInterval(listener, 1000);
  return () => clearInterval(id);
};
const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => null;

/** End of the current week (Sunday 23:59:59 local time). */
export function endOfWeek(nowMs) {
  const date = new Date(nowMs);
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7));
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

/** End of the current month. */
export function endOfMonth(nowMs) {
  const date = new Date(nowMs);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
}

/**
 * Returns the time left until `getTarget(now)`, or `null` before hydration
 * (so server and client markup match). The target rolls over automatically.
 */
export function useCountdown(getTarget) {
  const nowSeconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (nowSeconds === null) return null;

  const now = nowSeconds * 1000;
  const diff = Math.max(0, getTarget(now) - now);
  const pad = (value) => String(value).padStart(2, "0");

  return {
    days: pad(Math.floor(diff / 86_400_000)),
    hours: pad(Math.floor((diff / 3_600_000) % 24)),
    minutes: pad(Math.floor((diff / 60_000) % 60)),
    seconds: pad(Math.floor((diff / 1000) % 60)),
  };
}
