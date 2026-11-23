import "server-only";

import { randomInt } from "node:crypto";

import { prisma } from "@/lib/prisma";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Human-friendly order number, e.g. "WZ-7K3P9Q2M". */
export function generateOrderNumber() {
  let code = "";
  for (let index = 0; index < 8; index += 1) code += ALPHABET[randomInt(ALPHABET.length)];
  return `WZ-${code}`;
}

export const orderListSelect = {
  id: true,
  number: true,
  status: true,
  total: true,
  createdAt: true,
  customerName: true,
  email: true,
  userId: true,
  _count: { select: { items: true } },
  items: { select: { imageUrl: true, name: true }, take: 3 },
};

export const orderDetailInclude = {
  items: true,
  user: { select: { id: true, name: true, email: true, avatar: { select: { updatedAt: true } } } },
};

export function getUserOrders(userId) {
  return prisma.order.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, select: orderListSelect });
}

export function getUserOrder(userId, number) {
  if (!userId || !number) return null;
  return prisma.order.findFirst({ where: { userId, number }, include: { items: true } });
}

/** Statuses a customer may still cancel from. */
export const CANCELLABLE = ["PENDING", "PROCESSING"];

/**
 * Deleting an account deletes its orders (cascade), so it's refused while an order is still
 * being fulfilled — otherwise the store would lose an order it still has to deliver.
 */
export async function hasOpenOrders(userId) {
  return (await prisma.order.count({ where: { userId, status: { in: ["PENDING", "PROCESSING", "SHIPPED"] } } })) > 0;
}
