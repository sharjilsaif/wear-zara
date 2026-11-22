import { cn } from "@/lib/format";

/** Shimmer placeholder shown while real data loads. */
export default function Skeleton({ className }) {
  return (
    <div aria-hidden className={cn("relative overflow-hidden rounded-2xl bg-skeleton", className)}>
      <div className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-white/40 to-transparent dark:via-white/5" />
    </div>
  );
}
