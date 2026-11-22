"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LuHeart, LuLayoutDashboard, LuLogOut, LuPackage, LuUser } from "react-icons/lu";

import Avatar from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/iconButton";
import Menu, { menuItemClasses } from "@/components/ui/menu";
import { ConfirmDialog } from "@/components/ui/modal";
import Skeleton from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";
import { resetLocalStore } from "@/lib/store";

/** Logs out and clears this device's copy of the cart/wishlist (they stay saved in the account). */
export async function logout() {
  resetLocalStore();
  await signOut({ redirectTo: "/" });
}

export default function AccountMenu() {
  const { t } = useI18n();
  const { data: session, status } = useSession();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  if (status === "loading") return <Skeleton className="h-9 w-9 rounded-full" />;

  if (!session?.user) {
    return (
      <>
        {/* Separate wrappers: utility "hidden" can lose to the buttons built-in display class. */}
        <span className="hidden lg:block">
          <Button href="/login" size="sm" variant="secondary">
            {t("nav.signIn")}
          </Button>
        </span>
        <span className="lg:hidden">
          <IconButton href="/login" label={t("nav.signIn")} variant="ghost">
            <LuUser />
          </IconButton>
        </span>
      </>
    );
  }

  const { name, email, image, isAdmin } = session.user;
  const links = [
    { href: "/account", icon: LuUser, label: t("account.profile") },
    { href: "/account/orders", icon: LuPackage, label: t("account.orders") },
    { href: "/wishlist", icon: LuHeart, label: t("nav.wishlist") },
    ...(isAdmin ? [{ href: "/admin", icon: LuLayoutDashboard, label: t("admin.title") }] : []),
  ];

  return (
    <>
      <Menu
        panelClassName="w-72"
        trigger={({ open, toggle }) => (
          <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label={t("account.menu")} onClick={toggle} className="rounded-full transition-transform active:scale-95">
            <Avatar src={image} name={name} size="sm" />
          </button>
        )}
      >
        {(close) => (
          <>
            <div className="mb-1 flex items-center gap-3 rounded-xl bg-fg/4 p-3">
              <Avatar src={image} name={name} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{name}</p>
                <p className="truncate text-xs text-fg-muted">{email}</p>
              </div>
            </div>
            {links.map(({ href, icon: Icon, label }) => (
              <Link key={href} role="menuitem" href={href} className={menuItemClasses} onClick={close}>
                <Icon aria-hidden className="text-base text-fg-muted" /> {label}
              </Link>
            ))}
            <div className="my-1 h-px bg-line" />
            <button role="menuitem" type="button" className={cn(menuItemClasses, "text-sale")} onClick={() => (close(), setConfirm(true))}>
              <LuLogOut aria-hidden className="text-base" /> {t("account.logout")}
            </button>
          </>
        )}
      </Menu>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => (setBusy(true), logout())}
        loading={busy}
        title={t("account.logoutTitle")}
        description={t("account.logoutText")}
        confirmLabel={t("account.logout")}
        tone="primary"
      />
    </>
  );
}
