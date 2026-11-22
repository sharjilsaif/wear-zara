import "server-only";

import { prisma } from "@/lib/prisma";

export function normalizeCode(code) {
  return String(code ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

export async function findCoupon(code) {
  const normalized = normalizeCode(code);
  if (!normalized) return null;
  return prisma.coupon.findUnique({ where: { code: normalized } });
}

/** The fields the storefront needs to show and apply a coupon. */
export function publicCoupon(coupon) {
  return {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    minSubtotal: coupon.minSubtotal,
    description: coupon.description,
  };
}

/** Validates the coupon form. Shared with PATCH. */
export function parseCoupon(body) {
  const code = normalizeCode(body?.code);
  const type = body?.type === "FIXED" ? "FIXED" : "PERCENT";
  const value = Number(body?.value);
  const minSubtotal = Number(body?.minSubtotal) || 0;
  const maxUses = body?.maxUses === "" || body?.maxUses == null ? null : Math.floor(Number(body.maxUses));
  const expiresAt = body?.expiresAt ? new Date(body.expiresAt) : null;

  const fields = {};
  if (!/^[A-Z0-9_-]{3,20}$/.test(code)) fields.code = "couponCode";
  if (!(value > 0) || (type === "PERCENT" && value > 100)) fields.value = "couponValue";
  if (minSubtotal < 0) fields.minSubtotal = "price";
  if (maxUses !== null && !(maxUses >= 1)) fields.maxUses = "maxUses";
  if (expiresAt && Number.isNaN(expiresAt.getTime())) fields.expiresAt = "date";
  if (Object.keys(fields).length) return { fields };

  const description = String(body?.description ?? "").trim().slice(0, 120) || null;
  return { data: { code, type, value, minSubtotal, maxUses, expiresAt, description, active: body?.active !== false } };
}
