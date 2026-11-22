import { revalidatePath } from "next/cache";

import { getCategories } from "@/lib/catalog";
import { slugify } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    return Response.json(await getCategories());
  } catch (error) {
    console.error("Fetch categories failed:", error);
    return Response.json({ error: "Failed to fetch categories." }, { status: 500 });
  }
}

export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json().catch(() => ({}));
    const name = String(body?.name ?? "").trim();
    if (name.length < 2 || name.length > 50) {
      return Response.json({ error: "Category name must be 2–50 characters." }, { status: 400 });
    }

    const slug = slugify(name);
    const existing = await prisma.category.findFirst({
      where: { OR: [{ slug }, { name: { equals: name, mode: "insensitive" } }] },
      select: { id: true },
    });
    if (existing) {
      return Response.json({ error: "A category with this name already exists." }, { status: 409 });
    }

    const category = await prisma.category.create({ data: { name, slug } });
    revalidatePath("/", "layout");
    return Response.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Create category failed:", error);
    return Response.json({ error: "Failed to create category." }, { status: 500 });
  }
}

export async function DELETE(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Category id is required." }, { status: 400 });

  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/", "layout");
    return Response.json({ success: true });
  } catch (error) {
    if (error?.code === "P2025") return Response.json({ error: "Category not found." }, { status: 404 });
    console.error("Delete category failed:", error);
    return Response.json({ error: "Failed to delete category." }, { status: 500 });
  }
}
