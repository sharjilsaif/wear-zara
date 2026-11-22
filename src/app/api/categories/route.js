import { getCategories } from "@/lib/catalog";
import { fail, readJson, requireAdmin, revalidateStore } from "@/lib/api";
import { slugify } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    return Response.json(await getCategories());
  } catch (error) {
    console.error("Fetch categories failed:", error);
    return fail("server", 500);
  }
}

export async function POST(request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await readJson(request);
  const name = String(body?.name ?? "").trim();
  if (name.length < 2 || name.length > 50) return fail("validation", 422, { fields: { name: "categoryName" } });

  const slug = slugify(name);
  try {
    const existing = await prisma.category.findFirst({
      where: { OR: [{ slug }, { name: { equals: name, mode: "insensitive" } }] },
      select: { id: true },
    });
    if (existing) return fail("categoryExists", 409);

    const category = await prisma.category.create({ data: { name, slug } });
    revalidateStore();
    return Response.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Create category failed:", error);
    return fail("server", 500);
  }
}
