-- Additive: stock tracking (NULL = not tracked, so existing products stay purchasable) and an optional description.
ALTER TABLE "Product" ADD COLUMN "description" TEXT;
ALTER TABLE "Product" ADD COLUMN "stock" INTEGER;
ALTER TABLE "Product" ADD CONSTRAINT "Product_stock_nonnegative" CHECK ("stock" IS NULL OR "stock" >= 0);

-- Ratings are now derived from real customer reviews only; replace the hand-entered/seeded numbers.
ALTER TABLE "Product" ALTER COLUMN "rating" SET DEFAULT 0;
UPDATE "Product" p SET
  "reviews" = (SELECT COUNT(*) FROM "Review" r WHERE r."productId" = p."id"),
  "rating"  = COALESCE((SELECT ROUND(AVG(r."rating"))::int FROM "Review" r WHERE r."productId" = p."id"), 0);
