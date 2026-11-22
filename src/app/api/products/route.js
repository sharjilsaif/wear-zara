import { revalidatePath } from "next/cache";

import { getProducts, productSelect, SORT_OPTIONS } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const MAX_PAGE_SIZE = 50;

/** GET /api/products?category=&q=&sort=&page=&limit= */
export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const sort = params.get("sort");

  try {
    const result = await getProducts({
      category: params.get("category") || undefined,
      q: params.get("q")?.trim().slice(0, 80) || undefined,
      sort: SORT_OPTIONS[sort] ? sort : "newest",
      page: parseInt(params.get("page") ?? "1", 10) || 1,
      pageSize: Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(params.get("limit") ?? "12", 10) || 12)),
    });
    return Response.json(result);
  } catch (error) {
    console.error("Fetch products failed:", error);
    return Response.json({ error: "Failed to fetch products." }, { status: 500 });
  }
}

function parseOptionalNumber(value, parse) {
  if (value === null || value === undefined || value === "") return null;
  const number = parse(value);
  return Number.isFinite(number) ? number : NaN;
}

function validateProduct(body) {
  const name = String(body?.name ?? "").trim();
  const imageUrl = String(body?.imageUrl ?? "").trim();
  const price = Number.parseFloat(body?.price);
  const categoryIds = Array.isArray(body?.categoryIds) ? body.categoryIds.filter((id) => typeof id === "string") : [];
  const discountPrice = parseOptionalNumber(body?.discountPrice, Number.parseFloat);
  const reviews = parseOptionalNumber(body?.reviews, (value) => Number.parseInt(value, 10)) ?? 0;
  const rating = Math.min(5, Math.max(1, Number.parseInt(body?.rating, 10) || 5));

  if (name.length < 2 || name.length > 80) return { error: "Name must be 2–80 characters." };
  if (!Number.isFinite(price) || price <= 0) return { error: "Price must be a positive number." };

  try {
    if (new URL(imageUrl).protocol !== "https:") throw new Error();
  } catch {
    return { error: "Image URL must be a valid https:// link." };
  }

  if (categoryIds.length === 0) return { error: "Select at least one category." };
  if (Number.isNaN(discountPrice) || (discountPrice !== null && discountPrice <= price)) {
    return { error: "Original price must be higher than the sale price." };
  }
  if (Number.isNaN(reviews) || reviews < 0) return { error: "Reviews must be zero or more." };

  const discountPercentage = discountPrice ? Math.round((1 - price / discountPrice) * 100) : null;

  return { data: { name, imageUrl, price, discountPrice, discountPercentage, reviews, rating, categoryIds } };
}

export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const { data, error } = validateProduct(body);
  if (error) return Response.json({ error }, { status: 400 });

  try {
    const { categoryIds, ...fields } = data;
    const product = await prisma.product.create({
      data: { ...fields, categories: { connect: categoryIds.map((id) => ({ id })) } },
      select: productSelect,
    });
    revalidatePath("/", "layout");
    return Response.json({ product }, { status: 201 });
  } catch (err) {
    console.error("Create product failed:", err);
    return Response.json({ error: "Failed to save product." }, { status: 500 });
  }
}
