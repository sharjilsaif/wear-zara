import { notFound } from "next/navigation";

import { AdminHeader } from "@/components/admin/adminCard";
import ProductForm from "@/components/admin/productForm";
import { getAdminContext } from "@/lib/adminData";
import { getCategories } from "@/lib/catalog";
import { displayName } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function EditProduct({ params }) {
  const { id } = await params;
  const [{ t }, categories, product] = await Promise.all([
    getAdminContext(params),
    getCategories(),
    prisma.product.findUnique({ where: { id }, include: { categories: { select: { id: true } } } }),
  ]);
  if (!product) notFound();

  return (
    <>
      <title>{displayName(product.name)}</title>
      <AdminHeader title={t("admin.products.edit")} description={displayName(product.name)} />
      <ProductForm categories={categories} product={product} />
    </>
  );
}
