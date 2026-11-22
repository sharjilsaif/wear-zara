import Link from "next/link";

import Spinner from "@/components/ui/spinner";
import { cn } from "@/lib/format";

const VARIANTS = {
  primary: "bg-brand text-white shadow-[0_1px_2px_rgb(0_0_0/0.12),0_4px_14px_var(--brand-soft)] hover:bg-brand-hover active:bg-brand-active",
  secondary: "bg-fg/6 text-fg hover:bg-fg/10 active:bg-fg/15",
  dark: "bg-inverse text-inverse-fg hover:opacity-90 active:opacity-80",
  outline: "glass text-fg hover:bg-glass-strong",
  ghost: "text-fg hover:bg-fg/6",
  danger: "bg-sale text-white hover:opacity-90 active:opacity-80",
  "danger-soft": "bg-sale-soft text-sale hover:bg-sale/15",
  link: "h-auto! px-0! text-link hover:underline underline-offset-4",
};

const SIZES = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-6 text-sm",
  lg: "h-11 px-6 text-sm sm:h-12 sm:px-8 sm:text-[15px]",
};

/** The one button used across the app — renders a <Link> when `href` is given. */
export default function Button({ href, variant = "primary", size = "md", loading = false, className, children, type = "button", disabled, ...props }) {
  const classes = cn(
    "inline-flex select-none items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 ease-apple active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    SIZES[size],
    VARIANTS[variant],
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
