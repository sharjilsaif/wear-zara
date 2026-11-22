import { LANGUAGES } from "@/i18n/config";

/**
 * Builds `t(key, vars)` for a dictionary.
 * - Keys are dot paths: t("cart.title")
 * - `{name}` placeholders are replaced from `vars`
 * - Plural entries are objects ({ one, other }) picked with `vars.count`
 */
export function createTranslator(dict, lang) {
  const plural = new Intl.PluralRules(LANGUAGES[lang]?.intl ?? "en-US");

  const lookup = (key) => key.split(".").reduce((node, part) => (node == null ? node : node[part]), dict);

  return function t(key, vars) {
    let value = lookup(key);

    if (value && typeof value === "object" && vars?.count !== undefined) {
      value = value[plural.select(vars.count)] ?? value.other;
    }
    if (typeof value !== "string") return key;

    return vars ? value.replace(/\{(\w+)\}/g, (match, name) => (vars[name] ?? match).toString()) : value;
  };
}

/** Locale-aware price / number / date formatting (prices are always USD). */
export function createFormatters(lang) {
  const intl = LANGUAGES[lang]?.intl ?? "en-US";
  const currency = new Intl.NumberFormat(intl, { style: "currency", currency: "USD" });
  const number = new Intl.NumberFormat(intl);
  const date = new Intl.DateTimeFormat(intl, { dateStyle: "medium" });
  const dateTime = new Intl.DateTimeFormat(intl, { dateStyle: "medium", timeStyle: "short" });

  return {
    price: (value) => currency.format(Number(value) || 0),
    number: (value) => number.format(Number(value) || 0),
    date: (value) => date.format(new Date(value)),
    dateTime: (value) => dateTime.format(new Date(value)),
  };
}
