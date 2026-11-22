"use client";

import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

import { cn } from "@/lib/format";
import useMounted from "@/lib/useMounted";

/** Light/dark switch. Renders a same-size placeholder until mounted to avoid hydration mismatches. */
export default function ThemeToggle({ className }) {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) return <span aria-hidden className={cn("inline-block h-6 w-11", className)} />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-white/30 bg-white/15 p-0.5 transition-colors",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] text-[#111] shadow transition-transform duration-300",
          isDark && "translate-x-5",
        )}
      >
        {isDark ? <FiMoon /> : <FiSun />}
      </span>
    </button>
  );
}
