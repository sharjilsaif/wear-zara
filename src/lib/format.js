const SMALL_WORDS = new Set(["a", "an", "and", "by", "for", "in", "of", "on", "or", "the", "to", "with"]);

/** "PACK OF 3 PRINTED SHIRTS" -> "Pack of 3 Printed Shirts" */
export function displayName(name = "") {
  return name
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) =>
      index > 0 && SMALL_WORDS.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

/** The DB stores the pre-sale price in `discountPrice`; only show it when it is really higher. */
export function getOriginalPrice(product) {
  const price = Number(product?.price);
  const original = Number(product?.discountPrice);
  return original > price ? original : null;
}

/** Discount % derived from the two prices so the badge always matches what is shown. */
export function getDiscountPercent(product) {
  const original = getOriginalPrice(product);
  if (original) return Math.round((1 - Number(product.price) / original) * 100);
  return product?.discountPercentage || null;
}

export function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " ")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/** "Sharjil Malik" -> "SM" */
export function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "?";
}
