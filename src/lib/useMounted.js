"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** Hydration-safe "has the client mounted" flag (false on the server and during hydration). */
export default function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
