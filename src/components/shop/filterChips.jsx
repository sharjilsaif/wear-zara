import Link from "next/link";

import { cn } from "@/lib/format";

/** Horizontal list of link "chips" — used for category filters. */
export default function FilterChips({ items, label }) {
  return (
    <nav aria-label={label} className="no-scrollbar relative -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-2 sm:flex-wrap">
        {items.map((item) => (
          <li key={item.href} className="shrink-0">
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors",
                item.active ? "border-brand bg-brand text-white" : "border-line hover:border-fg/40",
              )}
            >
              {item.label}
              {item.count !== undefined && <span className={cn("ml-1.5 text-xs", item.active ? "text-white/80" : "text-fg-muted")}>{item.count}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
