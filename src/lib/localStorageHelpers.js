export function readStorageList(key) {
  if (typeof window === "undefined") return [];

  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function writeStorageList(key, items) {
  if (typeof window === "undefined") return;

  localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event(`${key}-updated`));
}

export function normalizeProduct(product) {
  if (!product) return null;

  const id = product.id ?? product._id ?? crypto.randomUUID();

  return {
    ...product,
    id,
    title: product.title ?? product.name ?? "Product",
    name: product.name ?? product.title ?? "Product",
    imageUrl: product.imageUrl ?? product.imgURL ?? product.image ?? "",
    imgURL: product.imgURL ?? product.imageUrl ?? product.image ?? "",
    price: Number(product.price ?? product.priceNow ?? 0),
    priceNow: Number(product.priceNow ?? product.price ?? 0),
    qty: Number(product.qty ?? 1),
    rating: Number(product.rating ?? product.reviews ?? 0),
    reviews: Number(product.reviews ?? product.rating ?? 0),
    discountPrice: product.discountPrice ?? null,
    discountPercentage: product.discountPercentage ?? null,
  };
}

export function toggleStoredItem(key, product) {
  const currentItems = readStorageList(key)
    .map(normalizeProduct)
    .filter(Boolean);
  const normalizedProduct = normalizeProduct(product);
  const exists = currentItems.some((item) => item.id === normalizedProduct.id);

  const updatedItems = exists
    ? currentItems.filter((item) => item.id !== normalizedProduct.id)
    : [...currentItems, normalizedProduct];

  writeStorageList(key, updatedItems);
  return updatedItems;
}
