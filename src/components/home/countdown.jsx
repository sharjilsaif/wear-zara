"use client";

import { Fragment } from "react";

import { cn } from "@/lib/format";
import { endOfMonth, endOfWeek, useCountdown } from "@/lib/useCountdown";

const TARGETS = { week: endOfWeek, month: endOfMonth };
const UNITS = [
  ["days", "Days"],
  ["hours", "Hours"],
  ["minutes", "Minutes"],
  ["seconds", "Seconds"],
];

/**
 * Live countdown. `until` is "week" (flash sale) or "month" (promo banner).
 * variant "plain" = big digits with colons, "circles" = white bubbles.
 */
export default function Countdown({ until = "week", variant = "plain", label = "Offer ends in" }) {
  const time = useCountdown(TARGETS[until]);
  const value = (key) => time?.[key] ?? "--";

  if (variant === "circles") {
    return (
      <div role="timer" aria-label={label} className="flex flex-wrap gap-3 sm:gap-5">
        {UNITS.map(([key, unit]) => (
          <div key={key} className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-white text-black">
            <span className="text-base font-semibold leading-none tabular-nums">{value(key)}</span>
            <span className="mt-1 text-[11px] leading-none">{unit}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div role="timer" aria-label={label} className="flex items-end gap-1">
      {UNITS.map(([key, unit], index) => (
        <Fragment key={key}>
          {index > 0 && (
            <span aria-hidden className="pb-1 text-2xl font-bold text-brand/70">
              :
            </span>
          )}
          <div className={cn("flex w-14 flex-col items-center")}>
            <span className="mb-1 text-xs font-medium">{unit}</span>
            <span className="text-3xl font-bold tracking-tight tabular-nums">{value(key)}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
