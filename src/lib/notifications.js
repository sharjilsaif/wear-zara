import "server-only";

import { adminEmails } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { LOW_STOCK } from "@/lib/site";

const RECENT_DAYS = 7;
const TAKE = 20;

// Things an admin must act on. Shared by the sidebar badge and the notifications page.
const needsAction = {
  orders: { status: "PENDING" },
  messages: { read: false },
  stock: { stock: 0 },
};

/** Sidebar badge: pending orders + unread messages + sold-out products. */
export async function countAdminNotifications() {
  const counts = await Promise.all([
    prisma.order.count({ where: needsAction.orders }),
    prisma.contactMessage.count({ where: needsAction.messages }),
    prisma.product.count({ where: needsAction.stock }),
  ]);
  return counts.reduce((sum, count) => sum + count, 0);
}

/**
 * The admin's notification feed, newest first. Derived from live data (no separate table),
 * so an item disappears by itself once it's handled — e.g. the order is processed or restocked.
 */
export async function getAdminNotifications() {
  const since = new Date(Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000);
  const [orders, messages, stock, reviews, customers] = await Promise.all([
    prisma.order.findMany({ where: needsAction.orders, orderBy: { createdAt: "desc" }, take: TAKE, select: { number: true, customerName: true, total: true, createdAt: true } }),
    prisma.contactMessage.findMany({ where: needsAction.messages, orderBy: { createdAt: "desc" }, take: TAKE, select: { id: true, name: true, createdAt: true } }),
    prisma.product.findMany({ where: { stock: { lte: LOW_STOCK } }, orderBy: { stock: "asc" }, take: TAKE, select: { id: true, name: true, stock: true, updatedAt: true } }),
    prisma.review.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: TAKE,
      select: { id: true, rating: true, createdAt: true, productId: true, product: { select: { name: true } }, user: { select: { name: true } } },
    }),
    prisma.user.findMany({ where: { createdAt: { gte: since }, email: { notIn: adminEmails() } }, orderBy: { createdAt: "desc" }, take: TAKE, select: { id: true, name: true, createdAt: true } }),
  ]);

  return [
    ...orders.map((order) => ({ id: `order-${order.number}`, kind: "newOrder", urgent: true, date: order.createdAt, href: `/admin/orders/${order.number}`, vars: { number: order.number, name: order.customerName, total: order.total } })),
    ...messages.map((message) => ({ id: `message-${message.id}`, kind: "message", urgent: true, date: message.createdAt, href: "/admin/messages", vars: { name: message.name } })),
    ...stock.map((product) => ({ id: `stock-${product.id}`, kind: product.stock === 0 ? "outOfStock" : "lowStock", urgent: product.stock === 0, date: product.updatedAt, href: `/admin/products/${product.id}`, vars: { name: product.name, count: product.stock } })),
    ...reviews.map((review) => ({ id: `review-${review.id}`, kind: "review", date: review.createdAt, href: `/product/${review.productId}#reviews`, vars: { name: review.user.name, product: review.product.name, rating: review.rating } })),
    ...customers.map((user) => ({ id: `customer-${user.id}`, kind: "customer", date: user.createdAt, href: `/admin/users/${user.id}`, vars: { name: user.name } })),
  ].sort((a, b) => b.date - a.date);
}
