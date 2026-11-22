import CheckoutForm from "@/components/cart/checkoutForm";
import Breadcrumb from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <CheckoutForm />
    </div>
  );
}
