import { FiCheck } from "react-icons/fi";

import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/emptyState";

export const metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default async function OrderSuccessPage({ searchParams }) {
  const { order } = await searchParams;
  const orderNumber = typeof order === "string" && /^WZ-\d{6}$/.test(order) ? order : null;

  return (
    <div className="container-page py-10">
      <EmptyState
        icon={FiCheck}
        title="Thank you for your order!"
        description={
          orderNumber
            ? `Your order ${orderNumber} has been placed. You'll pay on delivery — we'll email you as soon as it ships.`
            : "Your order has been placed. We'll email you as soon as it ships."
        }
        className="py-28"
      >
        <Button href="/shop">Continue Shopping</Button>
        <Button href="/" variant="outline">
          Back to Home
        </Button>
      </EmptyState>
    </div>
  );
}
