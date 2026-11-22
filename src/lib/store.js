"use client";

import { useSyncExternalStore } from "react";

import { MAX_QTY } from "@/lib/site";

/*
 * localStorage-backed cart, wishlist and coupon. `useSyncExternalStore` keeps every
 * component (badges, cards, cart page, other tabs) in sync. When a user is signed in,
 * <AccountSync> sets `syncUser` and every change is also saved to their account.
 */

const KEYS = { cart: "cart", wishlist: "wishlist", coupon: "coupon", syncedUser: "wz-synced-user" };
const EMPTY = Object.freeze([]);
const cache = new Map();
const listeners = new Map();
let syncUser = null;

/** Product snapshot stored in the browser (also upgrades items saved by older versions). */
function toItem(product) {
  const id = product?.id ?? product?._id;
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

function readRaw(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Parsed + cached value, so snapshots stay referentially stable between renders. */
function read(key, parse) {
  if (typeof window === "undefined") return parse(null);
  const raw = readRaw(key);
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value;
  const value = parse(raw);
  cache.set(key, { raw, value });
  return value;
}

const parseList = (raw) => {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(toItem).filter(Boolean) : EMPTY;
  } catch {
    return EMPTY;
  }
};

const parseCoupon = (raw) => {
  try {
    const value = raw ? JSON.parse(raw) : null;
    return value?.code ? value : null;
  } catch {
    return null;
  }
};

function write(key, value) {
  try {
    if (value == null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    cache.set(key, { raw: Symbol("memory"), value }); // storage blocked — keep it in memory
  }
  listeners.get(key)?.forEach((listener) => listener());
}

function subscribe(key, listener) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(listener);
  const onStorage = (event) => (event.key === key || event.key === null) && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.get(key).delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const useKey = (key, parse, serverValue) =>
  useSyncExternalStore((listener) => subscribe(key, listener), () => read(key, parse), () => serverValue);

/** Fire-and-forget save to the signed-in user's account. */
function remote(url, method, body) {
  if (!syncUser) return;
  fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  }).catch(() => {});
}

const cart = () => read(KEYS.cart, parseList);
const wishlist = () => read(KEYS.wishlist, parseList);

/* ----------------------------- Cart ----------------------------- */

export const useCart = () => useKey(KEYS.cart, parseList, EMPTY);

export function setCartQty(product, qty) {
  const quantity = Math.min(MAX_QTY, Math.max(0, qty));
  const items = cart();
  const exists = items.some((item) => item.id === product.id);
  const next =
    quantity === 0
      ? items.filter((item) => item.id !== product.id)
      : exists
        ? items.map((item) => (item.id === product.id ? { ...item, qty: quantity } : item))
        : [...items, toItem({ ...product, qty: quantity })];
  write(KEYS.cart, next);
  remote("/api/cart", "PUT", { productId: product.id, quantity });
}

export function addToCart(product, qty = 1) {
  const current = cart().find((item) => item.id === product.id)?.qty ?? 0;
  setCartQty(product, current + qty);
}

export const removeFromCart = (product) => setCartQty(product, 0);

/** `local` = only this browser (the server already emptied the cart after an order). */
export function clearCart({ local = false } = {}) {
  write(KEYS.cart, []);
  if (!local) remote("/api/cart", "DELETE");
}

/* --------------------------- Wishlist --------------------------- */

export const useWishlist = () => useKey(KEYS.wishlist, parseList, EMPTY);

/** Returns `true` when the product was added, `false` when it was removed. */
export function toggleWishlist(product) {
  const items = wishlist();
  const exists = items.some((item) => item.id === product.id);
  write(KEYS.wishlist, exists ? items.filter((item) => item.id !== product.id) : [...items, toItem(product)]);
  if (exists) remote(`/api/wishlist?productId=${encodeURIComponent(product.id)}`, "DELETE");
  else remote("/api/wishlist", "POST", { productId: product.id });
  return !exists;
}

export function clearWishlist() {
  write(KEYS.wishlist, []);
  remote("/api/wishlist", "DELETE");
}

/* ---------------------------- Coupon ---------------------------- */

export const useCoupon = () => useKey(KEYS.coupon, parseCoupon, null);
export const setCoupon = (coupon) => write(KEYS.coupon, coupon ?? null);

/* ------------------------- Account sync ------------------------- */

/** Called by <AccountSync>: merge (first login on this device) or pull, then mirror the account. */
export async function syncWithAccount(userId) {
  const merge = readRaw(KEYS.syncedUser) !== JSON.stringify(userId);
  const body = merge
    ? { mode: "merge", cart: cart().map((item) => ({ productId: item.id, quantity: item.qty })), wishlist: wishlist().map((item) => item.id) }
    : { mode: "pull" };

  const response = await fetch("/api/sync", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!response.ok) return;
  const data = await response.json();

  write(KEYS.cart, data.cart);
  write(KEYS.wishlist, data.wishlist);
  write(KEYS.syncedUser, userId);
  syncUser = userId;
}

/** On logout: the cart and wishlist belong to the account, so remove them from this device. */
export function resetLocalStore() {
  syncUser = null;
  [KEYS.cart, KEYS.wishlist, KEYS.coupon, KEYS.syncedUser].forEach((key) => write(key, null));
}
