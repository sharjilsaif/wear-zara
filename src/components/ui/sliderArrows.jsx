"use client";

import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import IconButton from "@/components/ui/iconButton";
import { useI18n } from "@/i18n/client";

/** Previous / next buttons for a horizontal slider (mirrored for right-to-left languages). */
export default function SliderArrows({ targetRef }) {
  const { t } = useI18n();

  const scroll = (direction) => {
    const element = targetRef.current;
    if (!element) return;
    const rtl = getComputedStyle(element).direction === "rtl" ? -1 : 1;
    element.scrollBy({ left: direction * rtl * element.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="flex gap-2">
      <IconButton label={t("common.previous")} variant="glass" size="lg" onClick={() => scroll(-1)}>
        <LuChevronLeft className="rtl:-scale-x-100" />
      </IconButton>
      <IconButton label={t("common.next")} variant="glass" size="lg" onClick={() => scroll(1)}>
        <LuChevronRight className="rtl:-scale-x-100" />
      </IconButton>
    </div>
  );
}
