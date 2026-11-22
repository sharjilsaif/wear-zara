"use client";

import { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import { ToastProvider } from "@/components/ui/toast";
import { syncWithAccount } from "@/lib/store";

/** Mirrors the browser cart/wishlist with the signed-in user's account. */
function AccountSync() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) syncWithAccount(userId).catch(() => {});
  }, [userId]);

  return null;
}

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="wear-zara-theme" disableTransitionOnChange>
        <ToastProvider>
          <AccountSync />
          {children}
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
