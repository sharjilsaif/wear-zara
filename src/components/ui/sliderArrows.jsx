"use client";

import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import IconButton from "@/components/ui/iconButton";

/** Previous / next buttons shared by every horizontal slider. */
export default function SliderArrows({ onPrev, onNext, label = "items", prevDisabled, nextDisabled }) {
  return (
    <div className="flex gap-2">
      <IconButton label={`Previous ${label}`} size="lg" onClick={onPrev} disabled={prevDisabled}>
        <FiArrowLeft />
      </IconButton>
      <IconButton label={`Next ${label}`} size="lg" onClick={onNext} disabled={nextDisabled}>
        <FiArrowRight />
      </IconButton>
    </div>
  );
}

/** Scrolls a scroll container by ~one viewport of cards. */
export function scrollByPage(element, direction) {
  if (!element) return;
  element.scrollBy({ left: direction * element.clientWidth * 0.8, behavior: "smooth" });
}
