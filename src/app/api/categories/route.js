// app/api/categories/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. GET: Fetch all categories with dynamic live product counts
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { 
            products: true // Must match the exact lowercase name 'products' from your Category schema!
          }
        }
      }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// 2. POST: Create a new category
export async function POST(request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    // Convert e.g., "Home & Kitchen" -> "home-kitchen"
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") 
      .replace(/[\s_]+/g, "-")  
      .replace(/^-+|-+$/g, ""); 

    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return NextResponse.json({ error: "A category with this name or slug already exists" }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: { name, slug }
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

// 3. DELETE: Delete a category
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("id");

    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id: categoryId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category." }, { status: 500 });
  }
}