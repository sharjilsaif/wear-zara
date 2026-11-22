import "server-only";

import { LANGUAGES, hasLocale, DEFAULT_LOCALE } from "@/i18n/config";
import { createFormatters, createTranslator } from "@/i18n/translate";

const loaders = {
  en: () => import("./dictionaries/en").then((module) => module.default),
  ur: () => import("./dictionaries/ur").then((module) => module.default),
  es: () => import("./dictionaries/es").then((module) => module.default),
};

export async function getDictionary(lang) {
  return loaders[hasLocale(lang) ? lang : DEFAULT_LOCALE]();
}

/** Everything a server component needs to render in `lang`. */
export async function getI18n(lang) {
  const safeLang = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = await getDictionary(safeLang);
  return {
    lang: safeLang,
    dir: LANGUAGES[safeLang].dir,
    dict,
    t: createTranslator(dict, safeLang),
    format: createFormatters(safeLang),
  };
}

/**
 * `generateMetadata` for a page whose title/description live under `meta.<key>`.
 * Usage: export const generateMetadata = pageMetadata("cart", { robots: { index: false } });
 */
export function pageMetadata(key, extra = {}) {
  return async ({ params }) => {
    const { t } = await getI18n((await params).lang);
    const description = t(`meta.${key}.description`);
    return {
      title: t(`meta.${key}.title`),
      ...(description !== `meta.${key}.description` && { description }),
      ...extra,
    };
  };
}
