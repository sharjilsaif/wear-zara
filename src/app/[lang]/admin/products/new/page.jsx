import { AdminHeader } from "@/components/admin/adminCard";
import ProductForm from "@/components/admin/productForm";
import { pageMetadata } from "@/i18n/server";
import { getAdminContext } from "@/lib/adminData";
import { getCategories } from "@/lib/catalog";

export const generateMetadata = pageMetadata("adminNewProduct");

export default async function NewProduct({ params }) {
  const [{ t }, categories] = await Promise.all([getAdminContext(params), getCategories()]);
  return (
    <>
      <AdminHeader title={t("admin.products.add")} description={t("admin.products.addText")} />
      <ProductForm categories={categories} />
    </>
  );
}
