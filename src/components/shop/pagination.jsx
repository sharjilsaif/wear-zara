"use client";

import Link from "next/link";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";

/** Crawlable pagination. `hrefs` is the list of page URLs (index 0 = page 1). */
export default function Pagination({ page, hrefs }) {
  const { t, format } = useI18n();
  if (hrefs.length <= 1) return null;

  const base = "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition-all";
  const arrow = (target, label, Icon) =>
    target >= 1 && target <= hrefs.length ? (
      <Link href={hrefs[target - 1]} aria-label={label} className={cn(base, "glass hover:bg-glass-strong")}>
        <Icon className="rtl:-scale-x-100" />
      </Link>
    ) : null;

  return (
    <nav aria-label={t("common.pagination")} className="mt-14 flex flex-wrap items-center justify-center gap-2">
      {arrow(page - 1, t("common.previous"), LuChevronLeft)}
      {hrefs.map((href, index) => (
        <Link
          key={href}
          href={href}
          aria-current={index + 1 === page ? "page" : undefined}
          className={cn(base, index + 1 === page ? "bg-inverse text-inverse-fg" : "hover:bg-fg/6")}
        >
          {format.number(index + 1)}
        </Link>
      ))}
      {arrow(page + 1, t("common.next"), LuChevronRight)}
    </nav>
  );
}
