"use client";

import { useI18n } from "@/i18n/client";

/** Localised date in the viewer's time zone (server and browser zones may differ, hence the warning opt-out). */
export default function DateText({ value, withTime = false, className }) {
  const { format } = useI18n();
  return (
    <time dateTime={new Date(value).toISOString()} suppressHydrationWarning className={className}>
      {withTime ? format.dateTime(value) : format.date(value)}
    </time>
  );
}
