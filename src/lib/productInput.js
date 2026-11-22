// Validates the admin product form (create + edit). Returns { data } or { fields } with error codes.

function optionalNumber(value, parse) {
  if (value === null || value === undefined || value === "") return null;
  const number = parse(value);
  return Number.isFinite(number) ? number : NaN;
}

export function validateProductInput(body) {
  const name = String(body?.name ?? "").trim();
  const imageUrl = String(body?.imageUrl ?? "").trim();
  const price = Number.parseFloat(body?.price);
  const categoryIds = Array.isArray(body?.categoryIds) ? body.categoryIds.filter((id) => typeof id === "string") : [];
  const discountPrice = optionalNumber(body?.discountPrice, Number.parseFloat);
  const reviews = optionalNumber(body?.reviews, (value) => Number.parseInt(value, 10)) ?? 0;
  const rating = Math.min(5, Math.max(1, Number.parseInt(body?.rating, 10) || 5));

  const fields = {};
  if (name.length < 2 || name.length > 80) fields.name = "productName";
  if (!Number.isFinite(price) || price <= 0) fields.price = "price";

  let validUrl = false;
  try {
    validUrl = new URL(imageUrl).protocol === "https:";
  } catch {
    validUrl = false;
  }
  if (!validUrl) fields.imageUrl = "imageUrl";

  if (categoryIds.length === 0) fields.categoryIds = "categories";
  if (Number.isNaN(discountPrice) || (discountPrice !== null && Number.isFinite(price) && discountPrice <= price)) {
    fields.discountPrice = "originalPrice";
  }
  if (Number.isNaN(reviews) || reviews < 0) fields.reviews = "reviews";

  if (Object.keys(fields).length > 0) return { fields };

  const discountPercentage = discountPrice ? Math.round((1 - price / discountPrice) * 100) : null;
  return { data: { name, imageUrl, price, discountPrice, discountPercentage, reviews, rating, categoryIds } };
}
