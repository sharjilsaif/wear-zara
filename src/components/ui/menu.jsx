"use client";

import { useEffect, useRef, useState } from "react";

import { useLocalPath } from "@/i18n/client";
import { cn } from "@/lib/format";

/**
 * Dropdown that closes on outside click, Escape and navigation.
 * `trigger({ open, toggle })` renders the button; `children(close)` renders the panel content.
 */
export default function Menu({ trigger, children, className, panelClassName }) {
  const pathname = useLocalPath();
  const ref = useRef(null);
  const [openOn, setOpenOn] = useState(null);
  const open = openOn === pathname;
  const close = () => setOpenOn(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event) => !ref.current?.contains(event.target) && setOpenOn(null);
    const onKey = (event) => event.key === "Escape" && setOpenOn(null);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {trigger({ open, toggle: () => setOpenOn(open ? null : pathname) })}
      <div
        role="menu"
        className={cn(
          "glass-strong absolute end-0 top-[calc(100%+0.6rem)] z-50 min-w-56 origin-top-right rounded-2xl p-1.5 transition-all duration-200 ease-apple rtl:origin-top-left",
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0",
          panelClassName,
        )}
      >
        {children(close)}
      </div>
    </div>
  );
}

export const menuItemClasses =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition-colors hover:bg-fg/6 active:bg-fg/10";
