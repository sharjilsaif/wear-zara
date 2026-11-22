import Link from "next/link";

import { cn } from "@/lib/format";

const VARIANTS = {
  soft: "bg-fg/6 text-fg hover:bg-fg/10",
  glass: "glass text-fg hover:bg-glass-strong",
  ghost: "text-fg hover:bg-fg/6",
  solid: "bg-white/90 text-[#1d1d1f] shadow-[0_2px_10px_rgb(0_0_0/0.12)] backdrop-blur-md hover:bg-white",
};

const SIZES = { sm: "h-8 w-8 text-[15px]", md: "h-10 w-10 text-[19px]", lg: "h-11 w-11 text-xl" };

/** Round icon-only button. `label` is required for screen readers and the tooltip. */
export default function IconButton({ label, href, variant = "soft", size = "md", className, children, badge, ...props }) {
  const classes = cn(
    "relative inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-200 ease-apple active:scale-90 disabled:pointer-events-none disabled:opacity-35",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  const content = (
    <>
      {children}
      {badge > 0 && (
        <span
          key={badge}
          className="absolute -end-0.5 -top-0.5 flex h-[18px] min-w-[18px] animate-pop items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-bg"
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </>
  );

  return href ? (
    <Link href={href} aria-label={label} title={label} className={classes} {...props}>
      {content}
    </Link>
  ) : (
    <button type="button" aria-label={label} title={label} className={classes} {...props}>
      {content}
    </button>
  );
}
