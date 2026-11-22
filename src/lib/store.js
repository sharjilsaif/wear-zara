"use client";

import { useSyncExternalStore } from "react";

import { MAX_QTY } from "@/lib/site";

/*
 * Tiny localStorage-backed store for the cart and wishlist.
 * `useSyncExternalStore` keeps every component (navbar badges, product cards,
 * cart page, other tabs) in sync without effects or duplicated listeners.
 */

const CART_KEY = "cart";
const WISHLIST_KEY = "wishlist";
const COUPON_KEY = "coupon";

const EMPTY = Object.freeze([]);
const cache = new Map();
const listeners = new Map();

/** Snapshot of a product stored in the browser. Also upgrades items saved by older versions. */
function toItem(product) {
  if (!product) return null;
  const id = product.id ?? product._id;
  if (!id) return null;

  return {
    id,
    name: product.name ?? product.title ?? "Product",
    price: Number(product.price ?? product.priceNow ?? 0),
    discountPrice: product.discountPrice ?? null,
    discountPercentage: product.discountPercentage ?? null,
    imageUrl: product.imageUrl ?? product.imgURL ?? "",
    rating: Number(product.rating ?? 5),
    reviews: Number(product.reviews ?? 0),
    categories: Array.isArray(product.categories) ? product.categories : [],
    qty: Math.min(MAX_QTY, Math.max(1, Number(product.qty) || 1)),
  };
}

function read(key) {
  if (typeof window === "undefined") return EMPTY;

  let raw = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
  }

  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value;

  let value = EMPTY;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) value = parsed.map(toItem).filter(Boolean);
  } catch {
    value = EMPTY;
  }

  cache.set(key, { raw, value });
  return value;
}

function emit(key) {
  listeners.get(key)?.forEach((listener) => listener());
}

function write(key, items) {
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Ignore quota / privacy errors — the UI still updates for this session.
    cache.set(key, { raw: Symbol("memory"), value: items });
  }
  emit(key);
}

function subscribe(key, listener) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(listener);

  const onStorage = (event) => {
    if (event.key === key || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.get(key).delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function useList(key) {
  return useSyncExternalStore(
    (listener) => subscribe(key, listener),
    () => read(key),
    () => EMPTY,
  );
}

/* ----------------------------- Cart ----------------------------- */

export function useCart() {
  return useList(CART_KEY);
}

export function addToCart(product, qty = 1) {
  const items = read(CART_KEY);
  const existing = items.find((item) => item.id === product.id);

  const next = existing
    ? items.map((item) =>
        item.id === product.id ? { ...item, qty: Math.min(MAX_QTY, item.qty + qty) } : item,
      )
    : [...items, toItem({ ...product, qty })];

  write(CART_KEY, next);
}

export function setCartQty(id, qty) {
  const safeQty = Math.min(MAX_QTY, Math.max(1, qty));
  write(
    CART_KEY,
    read(CART_KEY).map((item) => (item.id === id ? { ...item, qty: safeQty } : item)),
  );
}

export function removeFromCart(id) {
  write(CART_KEY, read(CART_KEY).filter((item) => item.id !== id));
}

export function clearCart() {
  write(CART_KEY, []);
}

/* --------------------------- Wishlist --------------------------- */

export function useWishlist() {
  return useList(WISHLIST_KEY);
}

/** Returns `true` when the product was added, `false` when it was removed. */
export function toggleWishlist(product) {
  const items = read(WISHLIST_KEY);
  const exists = items.some((item) => item.id === product.id);

  write(
    WISHLIST_KEY,
    exists ? items.filter((item) => item.id !== product.id) : [...items, toItem(product)],
  );
  return !exists;
}

export function removeFromWishlist(id) {
  write(WISHLIST_KEY, read(WISHLIST_KEY).filter((item) => item.id !== id));
}

export function clearWishlist() {
  write(WISHLIST_KEY, []);
}

/* ---------------------------- Coupon ---------------------------- */

function readCoupon() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(COUPON_KEY);
  } catch {
    return null;
  }
}

export function useCoupon() {
  return useSyncExternalStore(
    (listener) => subscribe(COUPON_KEY, listener),
    readCoupon,
    () => null,
  );
}

export function setCoupon(code) {
  try {
    if (code) window.localStorage.setItem(COUPON_KEY, code);
    else window.localStorage.removeItem(COUPON_KEY);
  } catch {
    // ignore
  }
  emit(COUPON_KEY);
}
