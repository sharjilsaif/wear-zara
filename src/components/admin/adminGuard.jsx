"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LuShieldX } from "react-icons/lu";

import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/emptyState";
import { useI18n } from "@/i18n/client";

const SECONDS = 5;

/**
 * Second line of defence for the admin area. The server already redirects non-admins,
 * but if the session changes while a page is open (signed out in another tab, admin
 * rights removed…) this shows "not allowed" and sends the visitor home after 5 seconds.
 */
export default function AdminGuard({ children }) {
  const { t } = useI18n();
  const router = useRouter();
  const { data: session, status } = useSession();
  const denied = status === "unauthenticated" || (status === "authenticated" && !session?.user?.isAdmin);
  const [left, setLeft] = useState(SECONDS);

  useEffect(() => {
    if (!denied) return;
    const id = setInterval(() => setLeft((seconds) => seconds - 1), 1000);
    const timeout = setTimeout(() => router.replace("/"), SECONDS * 1000);
    return () => (clearInterval(id), clearTimeout(timeout));
  }, [denied, router]);

  if (!denied) return children;

  return (
    <div role="alert" className="container-page">
      <EmptyState icon={LuShieldX} title={t("admin.denied.title")} description={t("admin.denied.text", { seconds: Math.max(0, left) })} className="glass my-10 rounded-[2rem] py-24">
        <Button onClick={() => router.replace("/")}>{t("common.backHome")}</Button>
      </EmptyState>
    </div>
  );
}
