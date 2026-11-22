"use client";

import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";

import IconButton from "@/components/ui/iconButton";
import { useI18n } from "@/i18n/client";
import useMounted from "@/lib/useMounted";

/** Light/dark switch. Renders a same-size placeholder until mounted to avoid hydration mismatches. */
export default function ThemeToggle({ className }) {
  const { t } = useI18n();
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) return <span aria-hidden className={`inline-block h-10 w-10 ${className ?? ""}`} />;

  const isDark = resolvedTheme === "dark";
  return (
    <IconButton label={t(isDark ? "theme.light" : "theme.dark")} variant="ghost" className={className} onClick={() => setTheme(isDark ? "light" : "dark")}>
      {isDark ? <LuSun /> : <LuMoon />}
    </IconButton>
  );
}
