import WishlistView from "@/components/cart/wishlistView";
import Breadcrumb from "@/components/ui/breadcrumb";
import { getI18n, pageMetadata } from "@/i18n/server";

export const generateMetadata = pageMetadata("wishlist", { robots: { index: false } });

export default async function WishlistPage({ params }) {
  const { t } = await getI18n((await params).lang);
  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: t("nav.wishlist") }]} />
      <WishlistView />
    </div>
  );
}
