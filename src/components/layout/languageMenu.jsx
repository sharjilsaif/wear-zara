"use client";

import { LuCheck, LuGlobe } from "react-icons/lu";

import Menu, { menuItemClasses } from "@/components/ui/menu";
import { LANGUAGES, LOCALES } from "@/i18n/config";
import { switchLanguage, useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";

/** Globe button + language list. `inline` renders a segmented control instead (mobile menu). */
export default function LanguageMenu({ inline = false, className }) {
  const { t, lang } = useI18n();

  if (inline) {
    return (
      <div role="radiogroup" aria-label={t("language.label")} className={cn("grid grid-cols-3 rounded-full bg-fg/6 p-1", className)}>
        {LOCALES.map((code) => (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={code === lang}
            lang={code}
            onClick={() => code !== lang && switchLanguage(code)}
            className={cn("rounded-full py-1.5 text-[13px] font-medium transition-all", code === lang ? "bg-surface shadow-sm" : "text-fg-muted hover:text-fg")}
          >
            {LANGUAGES[code].label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <Menu
      className={className}
      panelClassName="min-w-44"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={t("language.label")}
          onClick={toggle}
          className="flex h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-colors hover:bg-fg/6"
        >
          <LuGlobe className="text-lg" />
          {LANGUAGES[lang].short}
        </button>
      )}
    >
      {(close) =>
        LOCALES.map((code) => (
          <button
            key={code}
            type="button"
            role="menuitemradio"
            aria-checked={code === lang}
            lang={code}
            className={cn(menuItemClasses, "justify-between")}
            onClick={() => (code === lang ? close() : switchLanguage(code))}
          >
            {LANGUAGES[code].label}
            {code === lang && <LuCheck className="text-brand" />}
          </button>
        ))
      }
    </Menu>
  );
}
