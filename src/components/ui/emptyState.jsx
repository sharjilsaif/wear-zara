import { cn } from "@/lib/format";

/** Friendly placeholder for empty carts, wishlists, search results... */
export default function EmptyState({ icon: Icon, title, description, children, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 px-4 py-20 text-center", className)}>
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft">
          <Icon aria-hidden className="text-3xl text-brand" />
        </div>
      )}
      <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      {description && <p className="max-w-md text-sm text-fg-muted">{description}</p>}
      {children && <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
