import "server-only";

import { productSelect } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { MAX_QTY } from "@/lib/site";

const clampQty = (value) => Math.min(MAX_QTY, Math.max(1, Math.floor(Number(value) || 1)));

/** Cart + wishlist in the same shape the browser store uses. */
export async function getUserLists(userId) {
  const [cart, wishlist] = await Promise.all([
    prisma.cartItem.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, select: { quantity: true, product: { select: productSelect } } }),
    prisma.wishlistItem.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, select: { product: { select: productSelect } } }),
  ]);

  return {
    cart: cart.map((item) => ({ ...item.product, qty: item.quantity })),
    wishlist: wishlist.map((item) => item.product),
  };
}

/** Only ids of products that still exist. */
async function existingIds(ids) {
  if (ids.length === 0) return new Set();
  const found = await prisma.product.findMany({ where: { id: { in: ids } }, select: { id: true } });
  return new Set(found.map((product) => product.id));
}

/**
 * Merges a guest's browser cart/wishlist into their account (idempotent:
 * quantities take the larger value, wishlist is a union).
 */
export async function mergeUserLists(userId, { cart = [], wishlist = [] }) {
  const cartInput = cart.filter((item) => typeof item?.productId === "string").slice(0, 100);
  const wishlistInput = wishlist.filter((id) => typeof id === "string").slice(0, 200);
  const valid = await existingIds([...new Set([...cartInput.map((item) => item.productId), ...wishlistInput])]);

  const current = await prisma.cartItem.findMany({ where: { userId }, select: { productId: true, quantity: true } });
  const currentQty = new Map(current.map((item) => [item.productId, item.quantity]));

  const writes = cartInput
    .filter((item) => valid.has(item.productId))
    .map((item) => {
      const quantity = clampQty(Math.max(currentQty.get(item.productId) ?? 0, item.quantity));
      return prisma.cartItem.upsert({
        where: { userId_productId: { userId, productId: item.productId } },
        create: { userId, productId: item.productId, quantity },
        update: { quantity },
      });
    });

  const wishlistIds = wishlistInput.filter((id) => valid.has(id));
  if (wishlistIds.length > 0) {
    writes.push(
      prisma.wishlistItem.createMany({ data: wishlistIds.map((productId) => ({ userId, productId })), skipDuplicates: true }),
    );
  }

  if (writes.length > 0) await prisma.$transaction(writes);
}

export async function setCartQuantity(userId, productId, quantity) {
  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { userId, productId } });
    return;
  }
  const qty = clampQty(quantity);
  await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    create: { userId, productId, quantity: qty },
    update: { quantity: qty },
  });
}
