import Link from "next/link";

import Spinner from "@/components/ui/spinner";
import { cn } from "@/lib/format";

const VARIANTS = {
  primary: "bg-brand text-white hover:bg-brand-hover active:bg-brand-active",
  dark: "bg-inverse text-inverse-fg hover:opacity-90 active:opacity-80",
  outline: "border border-line bg-surface text-fg hover:bg-surface-muted active:bg-line",
  ghost: "text-fg hover:bg-surface-muted active:bg-line",
  danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
  "danger-outline":
    "border border-red-200 bg-red-50/60 text-brand hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/20 dark:hover:bg-red-950/40",
};

const SIZES = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-9 text-sm",
};

/**
 * The one button used across the app. Renders a <Link> when `href` is given.
 */
export default function Button({
  href,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  type = "button",
  disabled,
  ...props
}) {
  const classes = cn(
    "inline-flex select-none items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading ? <Spinner /> : children}
    </button>
  );
}
