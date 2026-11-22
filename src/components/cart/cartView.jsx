"use client";

import { IoCartOutline } from "react-icons/io5";

import CartLineItem from "@/components/cart/cartLineItem";
import CouponForm from "@/components/cart/couponForm";
import OrderSummary from "@/components/cart/orderSummary";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/emptyState";
import Skeleton from "@/components/ui/skeleton";
import { getCartTotals } from "@/lib/cartTotals";
import { clearCart, useCart, useCoupon } from "@/lib/store";
import useMounted from "@/lib/useMounted";

export default function CartView() {
  const mounted = useMounted();
  const cart = useCart();
  const coupon = useCoupon();

  if (!mounted) return <Skeleton className="h-80 w-full rounded-xl" />;

  if (cart.length === 0) {
    return (
      <EmptyState icon={IoCartOutline} title="Your cart is empty" description="Looks like you haven't added anything yet. Explore our latest styles.">
        <Button href="/shop">Continue Shopping</Button>
      </EmptyState>
    );
  }

  const totals = getCartTotals(cart, coupon);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div>
        <div className="mb-4 hidden grid-cols-[2fr_1fr_1fr_1fr] gap-4 rounded-xl border border-line px-6 py-4 text-sm font-medium sm:grid">
          <span>Product</span>
          <span className="text-center">Price</span>
          <span className="text-center">Quantity</span>
          <span className="text-right">Subtotal</span>
        </div>

        <ul className="flex flex-col gap-4">
          {cart.map((item) => (
            <CartLineItem key={item.id} item={item} />
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button href="/shop" variant="outline">
            ← Return to Shop
          </Button>
          <Button variant="danger-outline" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>
      </div>

      <aside className="rounded-2xl border border-fg/80 p-6 lg:sticky lg:top-36">
        <h2 className="mb-2 text-lg font-semibold">Cart Total</h2>
        <OrderSummary totals={totals} />
        <div className="mt-5">
          <CouponForm />
        </div>
        <Button href="/checkout" className="mt-5 w-full">
          Proceed to Checkout
        </Button>
      </aside>
    </div>
  );
}
