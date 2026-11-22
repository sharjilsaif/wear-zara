import { cn } from "@/lib/format";

export function Eyebrow({ children, className }) {
  return <p className={cn("text-sm font-semibold text-brand", className)}>{children}</p>;
}

/** Section heading: eyebrow, title, an inline slot (`children`) and an end slot (`aside`). */
export default function SectionHeader({ eyebrow, title, as: Heading = "h2", children, aside, className }) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-10 lg:gap-16">
        <div>
          {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
          <Heading className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">{title}</Heading>
        </div>
        {children}
      </div>
      {aside && <div className="flex shrink-0 items-center gap-3">{aside}</div>}
    </div>
  );
}
