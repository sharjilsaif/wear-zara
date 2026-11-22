import { fail, readJson, requireAdmin, revalidateStore } from "@/lib/api";
import { prisma } from "@/lib/prisma";

/** Rename a category (its URL slug stays the same so existing links keep working). */
export async function PATCH(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await readJson(request);
  const name = String(body?.name ?? "").trim();
  if (name.length < 2 || name.length > 50) return fail("validation", 422, { fields: { name: "categoryName" } });

  try {
    const clash = await prisma.category.findFirst({
      where: { id: { not: id }, name: { equals: name, mode: "insensitive" } },
      select: { id: true },
    });
    if (clash) return fail("categoryExists", 409);

    const category = await prisma.category.update({ where: { id }, data: { name } });
    revalidateStore();
    return Response.json({ category });
  } catch (error) {
    if (error?.code === "P2025") return fail("notFound", 404);
    console.error("Rename category failed:", error);
    return fail("server", 500);
  }
}

export async function DELETE(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await prisma.category.delete({ where: { id } });
    revalidateStore();
    return Response.json({ success: true });
  } catch (error) {
    if (error?.code === "P2025") return fail("notFound", 404);
    console.error("Delete category failed:", error);
    return fail("server", 500);
  }
}
