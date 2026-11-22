import { cn } from "@/lib/format";

/** Friendly placeholder for empty carts, wishlists, search results… */
export default function EmptyState({ icon: Icon, title, description, children, className }) {
  return (
    <div className={cn("flex animate-fade-up flex-col items-center justify-center gap-4 px-4 py-20 text-center", className)}>
      {Icon && (
        <div className="glass mb-2 flex h-20 w-20 items-center justify-center rounded-[1.75rem]">
          <Icon aria-hidden className="text-[2rem] text-brand" />
        </div>
      )}
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {description && <p className="max-w-md text-[15px] text-fg-muted">{description}</p>}
      {children && <div className="mt-3 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
