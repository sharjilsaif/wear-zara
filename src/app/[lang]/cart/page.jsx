import CartView from "@/components/cart/cartView";
import Breadcrumb from "@/components/ui/breadcrumb";
import { getI18n, pageMetadata } from "@/i18n/server";

export const generateMetadata = pageMetadata("cart", { robots: { index: false } });

export default async function CartPage({ params }) {
  const { t } = await getI18n((await params).lang);
  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: t("nav.cart") }]} />
      <CartView />
    </div>
  );
}
