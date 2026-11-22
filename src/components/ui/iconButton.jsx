import Link from "next/link";

import { cn } from "@/lib/format";

const VARIANTS = {
  soft: "bg-surface-muted text-fg hover:bg-line",
  floating: "bg-white text-[#111] shadow-sm hover:bg-brand-soft dark:bg-neutral-200",
  ghost: "text-fg hover:bg-surface-muted",
};

const SIZES = { sm: "h-8 w-8 text-base", md: "h-9 w-9 text-xl", lg: "h-11 w-11 text-xl" };

/** Round icon-only button. `label` is required for screen readers. */
export default function IconButton({ label, href, variant = "soft", size = "md", className, children, badge, ...props }) {
  const classes = cn(
    "relative inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  const content = (
    <>
      {children}
      {badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-none text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} title={label} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} title={label} className={classes} {...props}>
      {content}
    </button>
  );
}
