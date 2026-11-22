import { cn } from "@/lib/format";

/** Shimmer placeholder used while real data is loading. */
export default function Skeleton({ className }) {
  return (
    <div aria-hidden className={cn("relative overflow-hidden rounded-md bg-skeleton", className)}>
      <div className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-white/50 to-transparent dark:via-white/5" />
    </div>
  );
}
