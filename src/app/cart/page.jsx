import CartView from "@/components/cart/cartView";
import Breadcrumb from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Cart" }]} />
      <h1 className="sr-only">Shopping cart</h1>
      <CartView />
    </div>
  );
}
