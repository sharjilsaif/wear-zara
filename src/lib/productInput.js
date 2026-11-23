// Validates the admin product form (create + edit). Returns { data } or { fields } with error codes.
// Rating and review count are not accepted here: they are derived from real customer reviews.

function optionalNumber(value, parse) {
  if (value === null || value === undefined || value === "") return null;
  const number = parse(value);
  return Number.isFinite(number) ? number : NaN;
}

export function validateProductInput(body) {
  const name = String(body?.name ?? "").trim();
  const imageUrl = String(body?.imageUrl ?? "").trim();
  const description = String(body?.description ?? "").trim() || null;
  const price = Number.parseFloat(body?.price);
  const categoryIds = Array.isArray(body?.categoryIds) ? body.categoryIds.filter((id) => typeof id === "string") : [];
  const discountPrice = optionalNumber(body?.discountPrice, Number.parseFloat);
  // Empty = stock not tracked. Number() (not parseInt) so "2.5" or "3abc" are rejected.
  const stock = optionalNumber(body?.stock, Number);

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
  if (stock !== null && !(Number.isInteger(stock) && stock >= 0 && stock <= 1_000_000)) fields.stock = "stock";
  if (description && description.length > 2000) fields.description = "descriptionLong";

  if (Object.keys(fields).length > 0) return { fields };

  const discountPercentage = discountPrice ? Math.round((1 - price / discountPrice) * 100) : null;
  return { data: { name, imageUrl, description, price, discountPrice, discountPercentage, stock, categoryIds } };
}
