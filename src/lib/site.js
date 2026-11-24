// Single source of truth for store-wide settings used across many components.

export const SITE = {
  name: "Wear Zara",
  url: "https://wear-zara.vercel.app",
  // Real contact details are set per deployment; anything unset is hidden (never placeholder data).
  email: process.env.NEXT_PUBLIC_STORE_EMAIL || null,
  phone: process.env.NEXT_PUBLIC_STORE_PHONE || null,
  address: process.env.NEXT_PUBLIC_STORE_ADDRESS || null,
  author: { name: "Sharjil Malik", url: "https://github.com/sharjilsaif" },
};

/** Contact channels that are actually configured, for the footer and contact page. */
export function contactChannels() {
  return [
    SITE.phone && { kind: "phone", label: SITE.phone, href: `tel:${SITE.phone.replace(/[^d+]/g, "")}` },
    SITE.email && { kind: "email", label: SITE.email, href: `mailto:${SITE.email}` },
    SITE.address && { kind: "address", label: SITE.address, href: `https://maps.google.com/?q=${encodeURIComponent(SITE.address)}` },
  ].filter(Boolean);
}

export const FREE_SHIPPING_THRESHOLD = 140;
export const SHIPPING_FEE = 9.99;
export const MAX_QTY = 10;
export const RETURN_DAYS = 30;
/** At or below this many units a product shows "Only N left" and raises an admin notification. */
export const LOW_STOCK = 5;

/** Main navigation — labels come from the dictionary (`nav.*`). */
export const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/shop", key: "shop" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
];

// Shopper-facing categories (the DB also has merchandising-only ones such as "best-selling").
export const SHOP_CATEGORIES = [
  { slug: "mens-fashion", icon: "shirt" },
  { slug: "womens-fashion", icon: "dress" },
  { slug: "active-gymwear", icon: "barbell" },
  { slug: "outerwear-jackets", icon: "jacket" },
  { slug: "kids-baby-wear", icon: "baby" },
  { slug: "loungewear-sleepwear", icon: "moon" },
  { slug: "swim-beachwear", icon: "swim" },
  { slug: "footwear-shoes", icon: "shoe" },
  { slug: "bags-accessories", icon: "bag" },
];

export const MERCH_CATEGORY_SLUGS = ["best-selling", "explore-products", "flash-sales"];

export const ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function shopHref(params = {}) {
  const search = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  ).toString();
  return search ? `/shop?${search}` : "/shop";
}

/** Translated category name, falling back to the DB name for admin-created categories. */
export function categoryName(t, category) {
  const key = `categories.${category.slug}`;
  const translated = t(key);
  return translated === key ? category.name : translated;
}

/** First shopper-facing category of a product (skips merchandising groups like "best-selling"). */
export function primaryCategory(product) {
  return product?.categories?.find((category) => !MERCH_CATEGORY_SLUGS.includes(category.slug)) ?? null;
}
