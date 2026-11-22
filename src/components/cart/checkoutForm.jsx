"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IoCartOutline } from "react-icons/io5";

import OrderSummary from "@/components/cart/orderSummary";
import CouponForm from "@/components/cart/couponForm";
import ProductImage from "@/components/product/productImage";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/emptyState";
import FormField from "@/components/ui/formField";
import Skeleton from "@/components/ui/skeleton";
import { getCartTotals } from "@/lib/cartTotals";
import { displayName, formatPrice } from "@/lib/format";
import { clearCart, setCoupon, useCart, useCoupon } from "@/lib/store";
import useMounted from "@/lib/useMounted";
import { EMAIL_PATTERN } from "@/lib/validation";

const PHONE_PATTERN = /^[+\d][\d\s()-]{6,}$/;

function validate(data) {
  const errors = {};
  if (!data.name) errors.name = "Please enter your full name.";
  if (!data.street) errors.street = "Please enter your street address.";
  if (!data.city) errors.city = "Please enter your town or city.";
  if (!PHONE_PATTERN.test(data.phone)) errors.phone = "Please enter a valid phone number.";
  if (!EMAIL_PATTERN.test(data.email)) errors.email = "Please enter a valid email address.";
  return errors;
}

function createOrderNumber() {
  const digits = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return `WZ-${String(digits).padStart(6, "0")}`;
}

export default function CheckoutForm() {
  const router = useRouter();
  const mounted = useMounted();
  const { data: session } = useSession();
  const cart = useCart();
  const coupon = useCoupon();
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  if (!mounted) return <Skeleton className="h-96 w-full rounded-xl" />;

  if (cart.length === 0 && !placing) {
    return (
      <EmptyState icon={IoCartOutline} title="Your cart is empty" description="Add a few items to your cart before checking out.">
        <Button href="/shop">Start Shopping</Button>
      </EmptyState>
    );
  }

  const totals = getCartTotals(cart, coupon);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(
      Array.from(new FormData(event.currentTarget).entries()).map(([key, value]) => [key, String(value).trim()]),
    );

    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      event.currentTarget.querySelector("[aria-invalid='true']")?.focus();
      return;
    }

    setPlacing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    router.replace(`/checkout/success?order=${createOrderNumber()}`);
    clearCart();
    setCoupon(null);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-12 lg:grid-cols-[1fr_26rem]">
      <section aria-labelledby="billing-heading">
        <h1 id="billing-heading" className="mb-8 text-2xl font-semibold tracking-tight sm:text-4xl">
          Billing Details
        </h1>
        <div key={session?.user?.email ?? "guest"} className="grid gap-5 sm:max-w-xl">
          <FormField label="Full Name" name="name" required autoComplete="name" defaultValue={session?.user?.name ?? ""} error={errors.name} />
          <FormField label="Company Name" name="company" autoComplete="organization" />
          <FormField label="Street Address" name="street" required autoComplete="address-line1" error={errors.street} />
          <FormField label="Apartment, floor, etc." name="apartment" autoComplete="address-line2" />
          <FormField label="Town / City" name="city" required autoComplete="address-level2" error={errors.city} />
          <FormField label="Phone Number" name="phone" type="tel" required autoComplete="tel" error={errors.phone} />
          <FormField label="Email Address" name="email" type="email" required autoComplete="email" defaultValue={session?.user?.email ?? ""} error={errors.email} />
        </div>
      </section>

      <aside className="lg:pt-16">
        <ul className="mb-4 flex flex-col gap-4">
          {cart.map((item) => (
            <li key={item.id} className="flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                <ProductImage src={item.imageUrl} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <span className="flex-1 text-sm">
                {displayName(item.name)} <span className="text-fg-muted">× {item.qty}</span>
              </span>
              <span className="text-sm font-medium tabular-nums">{formatPrice(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>

        <OrderSummary totals={totals} />

        <fieldset className="mt-6 flex flex-col gap-3">
          <legend className="mb-3 text-sm font-medium">Payment method</legend>
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input type="radio" name="payment" value="cod" defaultChecked className="h-4 w-4 accent-brand" />
            Cash on delivery
          </label>
          <label className="flex items-center gap-3 text-sm text-fg-muted">
            <input type="radio" name="payment" value="card" disabled className="h-4 w-4" />
            Card payment <span className="rounded bg-surface-muted px-2 py-0.5 text-xs">Coming soon</span>
          </label>
        </fieldset>

        <div className="mt-6">
          <CouponForm />
        </div>

        <Button type="submit" size="lg" loading={placing} className="mt-6 w-full">
          Place Order
        </Button>
      </aside>
    </form>
  );
}
