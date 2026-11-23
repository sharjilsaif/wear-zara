import "server-only";

import { avatarUrl } from "@/lib/avatar";
import { prisma } from "@/lib/prisma";
import { MERCH_CATEGORY_SLUGS } from "@/lib/site";

// Only the fields the UI needs — keeps payloads small and safe to pass to client components.
export const productSelect = {
  id: true,
  name: true,
  price: true,
  imageUrl: true,
  rating: true,
  reviews: true,
  discountPrice: true,
  discountPercentage: true,
  stock: true,
  categories: { select: { name: true, slug: true } },
};

export const SORT_OPTIONS = {
  newest: { label: "Newest", orderBy: { createdAt: "desc" } },
  "price-asc": { label: "Price: Low to High", orderBy: { price: "asc" } },
  "price-desc": { label: "Price: High to Low", orderBy: { price: "desc" } },
  "name-asc": { label: "Name: A to Z", orderBy: { name: "asc" } },
};

export const PAGE_SIZE = 12;

function buildWhere({ category, q }) {
  const where = {};
  if (category) where.categories = { some: { slug: category } };
  if (q) where.name = { contains: q, mode: "insensitive" };
  return where;
}

export async function getProducts({ category, q, sort = "newest", page = 1, pageSize = PAGE_SIZE } = {}) {
  const where = buildWhere({ category, q });
  const orderBy = (SORT_OPTIONS[sort] ?? SORT_OPTIONS.newest).orderBy;
  const safePage = Math.max(1, Number(page) || 1);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [orderBy, { id: "asc" }],
      select: productSelect,
      skip: (safePage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page: safePage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getProductsByCategory(slug, take) {
  return prisma.product.findMany({
    where: { categories: { some: { slug } } },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    select: productSelect,
    take,
  });
}

export async function getProduct(id) {
  if (!id || typeof id !== "string") return null;
  return prisma.product.findUnique({ where: { id }, select: { ...productSelect, description: true } });
}

/**
 * Recomputes a product's cached rating + review count from the Review table.
 * Runs after the review write commits, so the last call always sees every committed review.
 */
export function refreshRating(productId) {
  return prisma.$executeRaw`
    UPDATE "Product" SET "reviews" = s.n, "rating" = s.avg
    FROM (SELECT COUNT(*)::int AS n, COALESCE(ROUND(AVG("rating")), 0)::int AS avg FROM "Review" WHERE "productId" = ${productId}) s
    WHERE "id" = ${productId}`;
}

/** schema.org availability for a product's stock (null = not tracked). */
export const availability = (stock) => `https://schema.org/${stock === 0 ? "OutOfStock" : "InStock"}`;

/** Products sharing a shopper-facing category with `product`. */
export async function getRelatedProducts(product, take = 4) {
  const slugs = product.categories
    .map((category) => category.slug)
    .filter((slug) => !MERCH_CATEGORY_SLUGS.includes(slug));

  if (slugs.length === 0) return [];

  return prisma.product.findMany({
    where: { id: { not: product.id }, categories: { some: { slug: { in: slugs } } } },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    select: productSelect,
    take,
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
  });
}

export async function getCategoryBySlug(slug) {
  if (!slug) return null;
  return prisma.category.findUnique({ where: { slug }, select: { name: true, slug: true } });
}

export async function getAllProductIds() {
  return prisma.product.findMany({ select: { id: true, updatedAt: true } });
}

/** Latest reviews for a product, with the author's name and profile picture. */
export async function getReviews(productId, take = 20) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    take,
    select: { id: true, rating: true, title: true, body: true, createdAt: true, userId: true, user: { select: { name: true, avatar: { select: { updatedAt: true } } } } },
  });
  return reviews.map(({ user, ...review }) => ({ ...review, name: user.name, image: avatarUrl(review.userId, user.avatar) }));
}
