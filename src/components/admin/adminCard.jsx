import { cn } from "@/lib/format";

/** Panel wrapper used by every admin section. */
export default function AdminCard({ title, description, children, className, aside }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-surface-raised p-6 shadow-sm", className)}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="mt-1 text-xs text-fg-muted">{description}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}
