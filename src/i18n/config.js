// Supported languages. Urdu is written right-to-left.

export const LOCALES = ["en", "ur", "es"];
export const DEFAULT_LOCALE = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LANGUAGES = {
  en: { label: "English", short: "EN", intl: "en-US", dir: "ltr" },
  ur: { label: "اردو", short: "UR", intl: "ur-PK", dir: "rtl" },
  es: { label: "Español", short: "ES", intl: "es-ES", dir: "ltr" },
};

export function hasLocale(value) {
  return LOCALES.includes(value);
}
