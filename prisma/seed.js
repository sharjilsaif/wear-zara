// Seeds the catalogue (categories + products) used by the live demo.
// Run with: npx prisma db seed   — safe to run repeatedly (upserts by id).

const { PrismaClient } = require("@prisma/client");
const data = require("./seed-data.json");

const prisma = new PrismaClient();

async function main() {
  for (const category of data.categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }

  // Insert oldest first so "Newest" sorting matches the live store.
  // Ratings come only from real customer reviews, so seeded rating/review numbers are ignored.
  for (const { categories, rating: _rating, reviews: _reviews, ...product } of data.products) {
    const connect = categories.map((slug) => ({ slug }));
    await prisma.product.upsert({
      where: { id: product.id },
      update: { ...product, categories: { set: connect } },
      create: { ...product, categories: { connect } },
    });
  }

  console.log(`Seeded ${data.categories.length} categories and ${data.products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
