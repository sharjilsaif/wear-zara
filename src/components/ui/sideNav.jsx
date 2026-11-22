"use client";

import Link from "next/link";
import { LuBox, LuFolder, LuHeart, LuLayoutDashboard, LuMail, LuMessageSquare, LuPackage, LuShoppingCart, LuStar, LuTicket, LuUser, LuUsers } from "react-icons/lu";

import { useI18n, useLocalPath } from "@/i18n/client";
import { cn } from "@/lib/format";

const ICONS = {
  user: LuUser,
  package: LuPackage,
  heart: LuHeart,
  dashboard: LuLayoutDashboard,
  orders: LuShoppingCart,
  products: LuBox,
  categories: LuFolder,
  coupons: LuTicket,
  users: LuUsers,
  messages: LuMessageSquare,
  reviews: LuStar,
  subscribers: LuMail,
};

/**
 * Section navigation for the account and admin areas: a sticky sidebar on desktop,
 * a horizontally scrolling pill bar on mobile. items: [{ href, key, icon: keyof ICONS, badge?, exact? }]
 */
export default function SideNav({ items, label, footer }) {
  const { t } = useI18n();
  const pathname = useLocalPath();
  const isActive = (item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  return (
    <nav aria-label={label} className="min-w-0 lg:sticky lg:top-28">
      <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
        {items.map((item) => {
          const active = isActive(item);
          const Icon = ICONS[item.icon];
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition-all duration-200 lg:rounded-2xl",
                  active ? "bg-inverse font-medium text-inverse-fg shadow-sm" : "glass lg:border-transparent lg:bg-transparent lg:shadow-none lg:backdrop-blur-none hover:bg-fg/6",
                )}
              >
                <Icon aria-hidden className="shrink-0 text-base" />
                <span>{t(item.key)}</span>
                {item.badge > 0 && (
                  <span className={cn("ms-auto rounded-full px-2 py-0.5 text-[11px] font-semibold", active ? "bg-white/20" : "bg-brand text-white")}>{item.badge}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      {footer}
    </nav>
  );
}
