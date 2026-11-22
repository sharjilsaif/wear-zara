import WishlistView from "@/components/cart/wishlistView";
import Breadcrumb from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Wishlist",
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Wishlist" }]} />
      <WishlistView />
    </div>
  );
}
