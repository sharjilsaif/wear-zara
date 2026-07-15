// app/api/products/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "0", 10);

    const whereClause = categorySlug
      ? { categories: { some: { slug: categorySlug } } }
      : {};

    const queryOptions = {
      where: whereClause,
      include: { categories: true },
      orderBy: { createdAt: "desc" },
    };

    if (limit > 0) {
      queryOptions.skip = (page - 1) * limit;
      queryOptions.take = limit;
    }

    const products = await prisma.product.findMany(queryOptions);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Prisma Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name, 
      price, 
      imageUrl, 
      categoryIds, 
      rating, 
      reviews, 
      discountPrice, 
      discountPercentage 
    } = body;

    // 1. Validate mandatory fields
    if (!name || !price || !imageUrl) {
      return NextResponse.json({ error: "Name, price, and imageUrl are required fields." }, { status: 400 });
    }

    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return NextResponse.json({ error: "At least one category must be selected." }, { status: 400 });
    }

    // 2. Safely parse numbers to prevent NaN database crashes
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return NextResponse.json({ error: "Invalid price format." }, { status: 400 });
    }

    // Safely handle optional numbers (convert empty strings to null instead of NaN)
    const parsedDiscountPrice = (discountPrice && discountPrice !== "") ? parseFloat(discountPrice) : null;
    const parsedDiscountPercentage = (discountPercentage && discountPercentage !== "") ? parseInt(discountPercentage, 10) : null;
    
    // Fallback to default rating of 5.0
    const parsedRating = (rating && rating !== "") ? parseFloat(rating) : 5.0;
    const parsedReviews = (reviews && reviews !== "") ? parseInt(reviews, 10) : 0;

    // Double-check if we generated NaN on any optional values
    if (parsedDiscountPrice !== null && isNaN(parsedDiscountPrice)) {
      return NextResponse.json({ error: "Invalid discount price format." }, { status: 400 });
    }
    if (parsedDiscountPercentage !== null && isNaN(parsedDiscountPercentage)) {
      return NextResponse.json({ error: "Invalid discount percentage format." }, { status: 400 });
    }

    // 3. Save clean, parsed product data to database
    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parsedPrice,
        imageUrl,
        rating: isNaN(parsedRating) ? 5.0 : parsedRating,
        reviews: isNaN(parsedReviews) ? 0 : parsedReviews,
        discountPrice: parsedDiscountPrice,
        discountPercentage: parsedDiscountPercentage,
        // Connect the product to all selected category IDs
        categories: {
          connect: categoryIds.map(id => ({ id }))
        }
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    // This will log the exact Prisma database error inside your backend terminal!
    console.error("CRITICAL ERROR SAVING PRODUCT:", error);
    return NextResponse.json({ 
      error: "Failed to save product", 
      details: error.message 
    }, { status: 500 });
  }
}