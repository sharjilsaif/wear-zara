import { LuPlus } from "react-icons/lu";

import { AdminHeader } from "@/components/admin/adminCard";
import ProductTable from "@/components/admin/productTable";
import Button from "@/components/ui/button";
import { pageMetadata } from "@/i18n/server";
import { getAdminContext } from "@/lib/adminData";
import { getProducts } from "@/lib/catalog";

export const generateMetadata = pageMetadata("adminProducts");

export default async function AdminProducts({ params }) {
  const [{ t }, { products }] = await Promise.all([getAdminContext(params), getProducts({ pageSize: 500 })]);

  return (
    <>
      <AdminHeader
        title={t("admin.nav.products")}
        description={t("admin.products.text")}
        actions={
          <Button href="/admin/products/new">
            <LuPlus /> {t("admin.products.add")}
          </Button>
        }
      />
      <ProductTable products={products} />
    </>
  );
}
