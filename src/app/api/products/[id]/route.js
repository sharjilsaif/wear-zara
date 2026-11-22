import { revalidatePath } from "next/cache";

import { getProduct } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(request, { params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return Response.json({ error: "Product not found." }, { status: 404 });
  return Response.json(product);
}

export async function DELETE(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/", "layout");
    return Response.json({ success: true });
  } catch (error) {
    if (error?.code === "P2025") return Response.json({ error: "Product not found." }, { status: 404 });
    console.error("Delete product failed:", error);
    return Response.json({ error: "Failed to delete product." }, { status: 500 });
  }
}
