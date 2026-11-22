import { FaStar } from "react-icons/fa6";

import { cn } from "@/lib/format";

/** Star rating that actually reflects the product's rating. */
export default function Stars({ rating = 0, reviews, size = "sm", className }) {
  const value = Math.round(Math.min(5, Math.max(0, Number(rating) || 0)));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div role="img" aria-label={`Rated ${value} out of 5`} className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map((index) => (
          <FaStar
            key={index}
            aria-hidden
            className={cn(size === "lg" ? "text-base" : "text-xs", index < value ? "text-amber-400" : "text-line")}
          />
        ))}
      </div>
      {reviews !== undefined && <span className="text-xs text-fg-muted">({reviews})</span>}
    </div>
  );
}
