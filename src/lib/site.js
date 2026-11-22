// Single source of truth for store-wide content used across many components.

export const SITE = {
  name: "Wear Zara",
  url: "https://wear-zara.vercel.app",
  description:
    "Wear Zara is a modern fashion store for men, women and kids — curated clothing, footwear and accessories with fast, free delivery.",
  email: "support@wearzara.com",
  phone: "+1 (234) 567-890",
  address: ["12 Baker Street", "London, United Kingdom"],
  author: { name: "Sharjil Malik", url: "https://github.com/sharjilsaif" },
};

export const FREE_SHIPPING_THRESHOLD = 140;
export const SHIPPING_FEE = 9.99;
export const MAX_QTY = 10;

export const COUPONS = {
  WELCOME10: { percent: 10, label: "10% off your first order" },
  ZARA20: { percent: 20, label: "20% off sitewide" },
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Shopper-facing categories (the DB also has merchandising-only ones such as "best-selling").
export const SHOP_CATEGORIES = [
  { slug: "mens-fashion", name: "Men's Fashion", icon: "shirt" },
  { slug: "womens-fashion", name: "Women's Fashion", icon: "dress" },
  { slug: "active-gymwear", name: "Active & Gymwear", icon: "barbell" },
  { slug: "outerwear-jackets", name: "Outerwear & Jackets", icon: "jacket" },
  { slug: "kids-baby-wear", name: "Kids & Baby Wear", icon: "baby" },
  { slug: "loungewear-sleepwear", name: "Loungewear & Sleepwear", icon: "moon" },
  { slug: "swim-beachwear", name: "Swim & Beachwear", icon: "swim" },
  { slug: "footwear-shoes", name: "Footwear & Shoes", icon: "shoe" },
  { slug: "bags-accessories", name: "Bags & Accessories", icon: "bag" },
];

export const MERCH_CATEGORY_SLUGS = ["best-selling", "explore-products", "flash-sales"];

export function shopHref(params = {}) {
  const search = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  ).toString();
  return search ? `/shop?${search}` : "/shop";
}
