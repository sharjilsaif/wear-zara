import { fail, readJson, requireAdmin, revalidateStore } from "@/lib/api";
import { getProduct, productSelect } from "@/lib/catalog";
import { validateProductInput } from "@/lib/productInput";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return fail("notFound", 404);
  return Response.json(product);
}

export async function PATCH(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const { data, fields } = validateProductInput(await readJson(request));
  if (fields) return fail("validation", 422, { fields });

  try {
    const { categoryIds, ...rest } = data;
    const product = await prisma.product.update({
      where: { id },
      data: { ...rest, categories: { set: categoryIds.map((categoryId) => ({ id: categoryId })) } },
      select: productSelect,
    });
    revalidateStore();
    return Response.json({ product });
  } catch (error) {
    if (error?.code === "P2025") return fail("notFound", 404);
    console.error("Update product failed:", error);
    return fail("server", 500);
  }
}

export async function DELETE(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    revalidateStore();
    return Response.json({ success: true });
  } catch (error) {
    if (error?.code === "P2025") return fail("notFound", 404);
    console.error("Delete product failed:", error);
    return fail("server", 500);
  }
}
