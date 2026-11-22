import Link from "next/link";

import { cn } from "@/lib/format";

/** items: [{ label, href? }] — the last item is the current page. */
export default function Breadcrumb({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-8 text-sm text-fg-muted", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="transition-colors hover:text-fg">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              <span aria-hidden>/</span>
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-fg">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={cn(isLast && "font-medium text-fg")}>
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
