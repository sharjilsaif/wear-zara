import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { cn } from "@/lib/format";

/** Server-rendered, crawlable pagination. `hrefFor(page)` builds each link. */
export default function Pagination({ page, totalPages, hrefFor }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const base = "flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className="mt-14 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={hrefFor(page - 1)} aria-label="Previous page" className={cn(base, "border-line hover:bg-surface-muted")}>
          <FiChevronLeft />
        </Link>
      )}
      {pages.map((number) => (
        <Link
          key={number}
          href={hrefFor(number)}
          aria-current={number === page ? "page" : undefined}
          className={cn(base, number === page ? "border-brand bg-brand text-white" : "border-line hover:bg-surface-muted")}
        >
          {number}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={hrefFor(page + 1)} aria-label="Next page" className={cn(base, "border-line hover:bg-surface-muted")}>
          <FiChevronRight />
        </Link>
      )}
    </nav>
  );
}
