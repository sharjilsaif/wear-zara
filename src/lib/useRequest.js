"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/i18n/client";

/** Translates an API error code, falling back to a generic message. */
export function errorText(t, code) {
  const key = `errors.${code}`;
  const message = t(key);
  return message === key ? t("errors.server") : message;
}

/**
 * JSON (or raw `blob`) request with consistent error toasts and an optional
 * success toast + router refresh. Resolves to { ok, ...responseBody }.
 */
export default function useRequest() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18n();
  const [pending, setPending] = useState(false);

  async function send(url, { method = "POST", body, blob, success, refresh = true, quiet = false } = {}) {
    setPending(true);
    try {
      const response = await fetch(url, {
        method,
        headers: blob ? { "Content-Type": blob.type } : body ? { "Content-Type": "application/json" } : undefined,
        body: blob ?? (body ? JSON.stringify(body) : undefined),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Field errors are shown inline by the form, everything else as a toast.
        if (data.error !== "validation" && !quiet) toast({ type: "error", title: errorText(t, data.error) });
        return { ok: false, ...data };
      }
      if (success) toast({ title: success });
      if (refresh) router.refresh();
      return { ok: true, ...data };
    } catch {
      toast({ type: "error", title: t("errors.network") });
      return { ok: false };
    } finally {
      setPending(false);
    }
  }

  return { send, pending };
}
