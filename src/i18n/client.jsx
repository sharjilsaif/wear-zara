"use client";

import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";

import { LANGUAGES, LOCALE_COOKIE, LOCALES } from "@/i18n/config";
import { createFormatters, createTranslator } from "@/i18n/translate";

const I18nContext = createContext(null);

export function I18nProvider({ lang, dict, children }) {
  const value = {
    lang,
    dir: LANGUAGES[lang].dir,
    t: createTranslator(dict, lang),
    format: createFormatters(lang),
  };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** { lang, dir, t, format } for client components. */
export function useI18n() {
  return useContext(I18nContext);
}

/**
 * The visible pathname without the internal locale segment.
 * (Pages live under /[lang]; the proxy rewrites "/shop" to "/en/shop", so the
 * server may report "/en/shop" while the browser shows "/shop".)
 */
export function useLocalPath() {
  const pathname = usePathname() ?? "/";
  const [, first, ...rest] = pathname.split("/");
  return LOCALES.includes(first) ? `/${rest.join("/")}` : pathname;
}

/** Saves the language choice and reloads so every page re-renders in it. */
export function switchLanguage(lang) {
  document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
  window.location.reload();
}
