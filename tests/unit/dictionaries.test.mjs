import assert from "node:assert/strict";
import { test } from "node:test";

import en from "@/i18n/dictionaries/en";
import enExtra from "@/i18n/dictionaries/en.extra";
import es from "@/i18n/dictionaries/es";
import esExtra from "@/i18n/dictionaries/es.extra";
import { mergeDeep } from "@/i18n/dictionaries/merge";
import ur from "@/i18n/dictionaries/ur";
import urExtra from "@/i18n/dictionaries/ur.extra";

/** Every leaf path, e.g. "product.outOfStock" (array items by index). */
function keys(value, prefix = "") {
  if (value === null || typeof value !== "object") return [prefix];
  return Object.entries(value).flatMap(([key, child]) => keys(child, prefix ? `${prefix}.${key}` : key));
}

test("Spanish and Urdu translate exactly the same keys as English", () => {
  const english = new Set(keys(mergeDeep(en, enExtra)));
  for (const [lang, dict] of [["es", mergeDeep(es, esExtra)], ["ur", mergeDeep(ur, urExtra)]]) {
    const other = new Set(keys(dict));
    assert.deepEqual([...english].filter((key) => !other.has(key)), [], `${lang} is missing keys`);
    assert.deepEqual([...other].filter((key) => !english.has(key)), [], `${lang} has extra keys`);
  }
});
