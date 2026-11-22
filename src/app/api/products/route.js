import { fail, readJson, requireAdmin, revalidateStore } from "@/lib/api";
import { getProducts, productSelect, SORT_OPTIONS } from "@/lib/catalog";
import { validateProductInput } from "@/lib/productInput";
import { prisma } from "@/lib/prisma";

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
      page: Number.parseInt(params.get("page") ?? "1", 10) || 1,
      pageSize: Math.min(MAX_PAGE_SIZE, Math.max(1, Number.parseInt(params.get("limit") ?? "12", 10) || 12)),
    });
    return Response.json(result);
  } catch (error) {
    console.error("Fetch products failed:", error);
    return fail("server", 500);
  }
}

export async function POST(request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { data, fields } = validateProductInput(await readJson(request));
  if (fields) return fail("validation", 422, { fields });

  try {
    const { categoryIds, ...rest } = data;
    const product = await prisma.product.create({
      data: { ...rest, categories: { connect: categoryIds.map((id) => ({ id })) } },
      select: productSelect,
    });
    revalidateStore();
    return Response.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Create product failed:", error);
    return fail("server", 500);
  }
}
