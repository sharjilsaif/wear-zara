import { AdminHeader } from "@/components/admin/adminCard";
import CategoryManager from "@/components/admin/categoryManager";
import { pageMetadata } from "@/i18n/server";
import { getAdminContext } from "@/lib/adminData";
import { getCategories } from "@/lib/catalog";

export const generateMetadata = pageMetadata("adminCategories");

export default async function AdminCategories({ params }) {
  const [{ t }, categories] = await Promise.all([getAdminContext(params), getCategories()]);
  return (
    <>
      <AdminHeader title={t("admin.nav.categories")} description={t("admin.categories.text")} />
      <CategoryManager categories={categories} />
    </>
  );
}
