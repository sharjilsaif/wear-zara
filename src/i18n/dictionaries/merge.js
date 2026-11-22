/** Deep-merges dictionary extensions into a base dictionary (objects merge, everything else replaces). */
export function mergeDeep(base, extra) {
  const out = { ...base };
  for (const [key, value] of Object.entries(extra)) {
    const isObject = value && typeof value === "object" && !Array.isArray(value);
    out[key] = isObject && base[key] && typeof base[key] === "object" ? mergeDeep(base[key], value) : value;
  }
  return out;
}
