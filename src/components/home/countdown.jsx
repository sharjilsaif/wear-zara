"use client";

import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";
import { endOfMonth, endOfWeek, useCountdown } from "@/lib/useCountdown";

const TARGETS = { week: endOfWeek, month: endOfMonth };
const UNITS = ["days", "hours", "minutes", "seconds"];

/** Live countdown to the end of the week (flash sale) or month (promo). `dark` for dark backgrounds. */
export default function Countdown({ until = "week", label, dark = false }) {
  const { t, format } = useI18n();
  const time = useCountdown(TARGETS[until]);

  return (
    <div role="timer" aria-label={label} className="flex gap-2 sm:gap-3">
      {UNITS.map((unit) => (
        <div
          key={unit}
          className={cn("flex h-16 w-16 flex-col items-center justify-center rounded-2xl sm:h-[4.5rem] sm:w-[4.5rem]", dark ? "bg-white/12 backdrop-blur-md" : "glass")}
        >
          <span className="text-xl font-semibold leading-none tabular-nums sm:text-2xl">{time ? format.number(time[unit]).padStart(2, "0") : "--"}</span>
          <span className={cn("mt-1.5 text-[10px] font-medium uppercase leading-none tracking-wide", dark ? "text-white/70" : "text-fg-muted")}>{t(`countdown.${unit}`)}</span>
        </div>
      ))}
    </div>
  );
}
