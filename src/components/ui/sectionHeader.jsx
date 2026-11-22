import { cn } from "@/lib/format";

/** Red tag + label shown above every section title ("Today's", "This Month", ...). */
export function Eyebrow({ children, className }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span aria-hidden className="h-8 w-4 rounded-sm bg-brand" />
      <p className="text-sm font-semibold text-brand">{children}</p>
    </div>
  );
}

/**
 * Standard section heading: eyebrow, title and an optional right-hand slot
 * (arrows, "View All", countdown...).
 */
export default function SectionHeader({ eyebrow, title, as: Heading = "h2", children, aside, className }) {
  return (
    <div className={cn("mb-8 sm:mb-10", className)}>
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-10 lg:gap-20">
          <Heading className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">{title}</Heading>
          {children}
        </div>
        {aside && <div className="flex shrink-0 items-center gap-3">{aside}</div>}
      </div>
    </div>
  );
}
