"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LuBell,
  LuBox,
  LuExternalLink,
  LuFolder,
  LuLayoutDashboard,
  LuLogOut,
  LuMail,
  LuMenu,
  LuMessageSquare,
  LuShoppingCart,
  LuStar,
  LuTicket,
  LuUser,
  LuUsers,
  LuX,
} from "react-icons/lu";

import { logout } from "@/components/layout/accountMenu";
import LanguageMenu from "@/components/layout/languageMenu";
import ThemeToggle from "@/components/layout/themeToggle";
import Avatar from "@/components/ui/avatar";
import IconButton from "@/components/ui/iconButton";
import { useI18n, useLocalPath } from "@/i18n/client";
import { cn } from "@/lib/format";

const ICONS = {
  dashboard: LuLayoutDashboard,
  bell: LuBell,
  orders: LuShoppingCart,
  coupons: LuTicket,
  products: LuBox,
  categories: LuFolder,
  reviews: LuStar,
  users: LuUsers,
  messages: LuMessageSquare,
  subscribers: LuMail,
};

/**
 * The admin console: its own sidebar + top bar instead of the storefront header and footer.
 * groups: [{ key?, items: [{ href, key, icon, badge?, exact? }] }]
 */
export default function AdminShell({ groups, user, notifications, children }) {
  const { t } = useI18n();
  const pathname = useLocalPath();
  // Tied to the path so the mobile drawer closes after navigating.
  const [openOn, setOpenOn] = useState(null);
  const open = openOn === pathname;
  const isActive = (item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-line px-5">
        <Link href="/admin" className="text-lg font-semibold tracking-tight">
          Wear<span className="text-brand">Zara</span>
          <span className="ms-2 rounded-md bg-fg/8 px-1.5 py-0.5 align-middle text-[11px] font-semibold uppercase tracking-wide text-fg-muted">{t("admin.title")}</span>
        </Link>
        <IconButton label={t("nav.closeMenu")} variant="ghost" size="sm" className="lg:hidden" onClick={() => setOpenOn(null)}>
          <LuX />
        </IconButton>
      </div>

      <nav aria-label={t("admin.title")} className="no-scrollbar flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group, index) => (
          <div key={group.key ?? index} className="mb-5 last:mb-0">
            {group.key && <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">{t(`admin.groups.${group.key}`)}</p>}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = isActive(item);
                const Icon = ICONS[item.icon];
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                        active ? "bg-brand-soft font-semibold text-brand" : "text-fg/80 hover:bg-fg/6 hover:text-fg",
                      )}
                    >
                      <Icon aria-hidden className="shrink-0 text-[17px]" />
                      <span className="truncate">{t(item.key)}</span>
                      {item.badge > 0 && <span className="ms-auto rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-white tabular-nums">{item.badge}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-line p-3">
        <Link href="/account" className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-fg/6">
          <Avatar src={user.image} name={user.name} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{user.name}</span>
            <span className="block truncate text-xs text-fg-muted" dir="ltr">
              {user.email}
            </span>
          </span>
          <LuUser aria-hidden className="shrink-0 text-fg-muted" />
        </Link>
        <button type="button" onClick={() => logout()} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-fg/80 transition-colors hover:bg-sale/10 hover:text-sale">
          <LuLogOut aria-hidden className="text-[17px]" /> {t("account.logout")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen border-e border-line bg-surface lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", !open && "pointer-events-none")} inert={!open}>
        <button type="button" aria-label={t("nav.closeMenu")} tabIndex={-1} onClick={() => setOpenOn(null)} className={cn("absolute inset-0 bg-black/40 transition-opacity", open ? "opacity-100" : "opacity-0")} />
        <aside className={cn("absolute inset-y-0 start-0 w-72 max-w-[85vw] bg-surface shadow-2xl transition-transform duration-300 ease-apple", open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full")}>
          {sidebar}
        </aside>
      </div>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-line bg-glass px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <IconButton label={t("nav.openMenu")} variant="ghost" className="lg:hidden" onClick={() => setOpenOn(pathname)}>
            <LuMenu />
          </IconButton>
          <Link href="/admin" className="text-base font-semibold tracking-tight lg:hidden">
            Wear<span className="text-brand">Zara</span>
          </Link>
          <div className="ms-auto flex items-center gap-1">
            <Link href="/" className="me-1 hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-fg/6 hover:text-fg sm:inline-flex">
              <LuExternalLink aria-hidden /> {t("admin.viewStore")}
            </Link>
            <LanguageMenu />
            <ThemeToggle />
            <IconButton href="/admin/notifications" label={t("admin.nav.notifications")} variant="ghost" badge={notifications}>
              <LuBell />
            </IconButton>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[90rem] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </div>
    </div>
  );
}
