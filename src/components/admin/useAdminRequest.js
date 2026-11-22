"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/toast";

/**
 * Sends an admin API request, shows a toast with the outcome and refreshes
 * the server-rendered data on success.
 */
export default function useAdminRequest() {
  const router = useRouter();
  const toast = useToast();
  const [pending, setPending] = useState(false);

  async function send(url, { method = "POST", body, success }) {
    setPending(true);
    try {
      const response = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error ?? "Request failed.");

      toast({ title: success });
      router.refresh();
      return true;
    } catch (error) {
      toast({ type: "error", title: "Something went wrong", description: error.message });
      return false;
    } finally {
      setPending(false);
    }
  }

  return { send, pending };
}
