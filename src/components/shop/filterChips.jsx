import Link from "next/link";

import { cn } from "@/lib/format";

/** Horizontal list of link "chips" — used for category / status filters. */
export default function FilterChips({ items, label }) {
  return (
    <nav aria-label={label} className="no-scrollbar relative -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-2 py-1 sm:flex-wrap">
        {items.map((item) => (
          <li key={item.href} className="shrink-0">
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm transition-all duration-200",
                item.active ? "bg-inverse font-medium text-inverse-fg shadow-sm" : "glass hover:bg-glass-strong",
              )}
            >
              {item.label}
              {item.count !== undefined && <span className={cn("text-xs", item.active ? "opacity-70" : "text-fg-muted")}>{item.count}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
