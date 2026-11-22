import Link from "next/link";

import { cn } from "@/lib/format";

/** Glass panel used by every admin section. */
export default function AdminCard({ title, description, children, className, aside }) {
  return (
    <section className={cn("glass rounded-3xl p-5 sm:p-6", className)}>
      {(title || aside) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && <p className="mt-1 text-[13px] text-fg-muted">{description}</p>}
          </div>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

/** Big number tile on the overview page; links to its section. */
export function StatCard({ label, value, hint, href, tone = "brand" }) {
  const tones = { brand: "from-brand/15", success: "from-success/15", warning: "from-warning/20", danger: "from-sale/15" };
  return (
    <Link href={href} className={cn("glass group relative overflow-hidden rounded-3xl p-5 transition-all duration-300 ease-apple hover:-translate-y-0.5")}>
      <div className={cn("pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-radial to-transparent blur-xl", tones[tone])} />
      <p className="text-[13px] text-fg-muted">{label}</p>
      <p className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-fg-muted">{hint}</p>}
    </Link>
  );
}

/** Page title row for an admin section. */
export function AdminHeader({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

/** Responsive table wrapper: scrolls sideways on small screens. */
export function Table({ head, children, empty }) {
  return (
    <div className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
      <table className="w-full min-w-[40rem] text-start text-sm">
        <thead className="text-xs text-fg-muted">
          <tr className="border-b border-line">
            {head.map((cell, index) => (
              <th key={index} className="py-3 pe-4 text-start font-medium last:pe-0">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
      {empty}
    </div>
  );
}
