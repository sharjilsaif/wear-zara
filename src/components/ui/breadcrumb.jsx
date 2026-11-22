"use client";

import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";

/** items: [{ label, href? }] — the last item is the current page. */
export default function Breadcrumb({ items, className }) {
  const { t } = useI18n();
  const all = [{ label: t("nav.home"), href: "/" }, ...items];

  return (
    <nav aria-label={t("common.breadcrumb")} className={cn("mb-8 text-[13px] text-fg-muted", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((item, index) => {
          const isLast = index === all.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 && <LuChevronRight aria-hidden className="shrink-0 opacity-50 rtl:-scale-x-100" />}
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-fg">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={cn("truncate", isLast && "font-medium text-fg")}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
