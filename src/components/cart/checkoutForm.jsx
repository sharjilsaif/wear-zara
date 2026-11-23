"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuBanknote, LuCreditCard, LuLock, LuShoppingBag } from "react-icons/lu";

import CouponForm from "@/components/cart/couponForm";
import OrderSummary from "@/components/cart/orderSummary";
import ProductImage from "@/components/product/productImage";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/emptyState";
import FormField from "@/components/ui/formField";
import Skeleton from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/i18n/client";
import { displayName } from "@/lib/format";
import { getCartTotals } from "@/lib/pricing";
import { clearCart, removeFromCart, setCartQty, setCoupon, useCart, useCoupon } from "@/lib/store";
import useMounted from "@/lib/useMounted";
import useRequest, { errorText } from "@/lib/useRequest";
import { validateCheckout } from "@/lib/validation";

/** `defaults` pre-fill the form from the account and the last order. */
export default function CheckoutForm({ defaults }) {
  const { t, format } = useI18n();
  const router = useRouter();
  const toast = useToast();
  const mounted = useMounted();
  const cart = useCart();
  const coupon = useCoupon();
  const { send } = useRequest();
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  if (!mounted) return <Skeleton className="h-[36rem] w-full rounded-3xl" />;

  if (cart.length === 0 && !placing) {
    return (
      <EmptyState icon={LuShoppingBag} title={t("cart.emptyTitle")} description={t("checkout.emptyText")}>
        <Button href="/shop" size="lg">
          {t("common.startShopping")}
        </Button>
      </EmptyState>
    );
  }

  const totals = getCartTotals(cart, coupon);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, String(value).trim()]));

    const fieldErrors = validateCheckout(data);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return form.querySelector("[aria-invalid='true']")?.focus();

    setPlacing(true);
    const result = await send("/api/orders", {
      body: { ...data, couponCode: totals.coupon?.code, items: cart.map((item) => ({ productId: item.id, quantity: item.qty })) },
      refresh: false,
      quiet: true,
    });

    if (result.ok) {
      router.replace(`/checkout/success?order=${result.order.number}`);
      clearCart({ local: true });
      setCoupon(null);
      return;
    }

    setPlacing(false);
    if (result.error === "validation") return setErrors(result.fields ?? {});
    if (result.error === "productsUnavailable") {
      cart.filter((item) => result.ids?.includes(item.id)).forEach((item) => removeFromCart(item));
      return toast({ type: "error", title: t("errors.productsUnavailable") });
    }
    if (result.error === "outOfStock") {
      // Bring the bag in line with what's left (0 removes the item) so the shopper can review and retry.
      for (const { id, stock } of result.items ?? []) {
        const item = cart.find((entry) => entry.id === id);
        if (item) setCartQty({ ...item, stock }, stock);
      }
      return toast({ type: "error", title: t("errors.outOfStock") });
    }
    if (result.error === "coupon") {
      setCoupon(null);
      return toast({ type: "error", title: t(`coupon.errors.${result.reason}`) });
    }
    toast({ type: "error", title: errorText(t, result.error) });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start">
      <section aria-labelledby="billing-heading" className="glass rounded-3xl p-6 sm:p-8">
        <h1 id="billing-heading" className="text-2xl sm:text-3xl font-semibold tracking-tight">
          {t("checkout.title")}
        </h1>
        <p className="mb-8 mt-1 text-sm text-fg-muted">{t("checkout.subtitle")}</p>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label={t("checkout.name")} name="name" required autoComplete="name" placeholder={t("checkout.namePlaceholder")} defaultValue={defaults.name} error={errors.name} />
          <FormField label={t("checkout.company")} name="company" autoComplete="organization" placeholder={t("common.optional")} defaultValue={defaults.company} />
          <FormField label={t("checkout.street")} name="street" required autoComplete="address-line1" placeholder={t("checkout.streetPlaceholder")} defaultValue={defaults.street} error={errors.street} className="sm:col-span-2" />
          <FormField label={t("checkout.apartment")} name="apartment" autoComplete="address-line2" placeholder={t("common.optional")} defaultValue={defaults.apartment} />
          <FormField label={t("checkout.city")} name="city" required autoComplete="address-level2" placeholder={t("checkout.cityPlaceholder")} defaultValue={defaults.city} error={errors.city} />
          <FormField label={t("checkout.phone")} name="phone" type="tel" required autoComplete="tel" placeholder="+92 300 1234567" defaultValue={defaults.phone} error={errors.phone} dir="ltr" />
          <FormField label={t("checkout.email")} name="email" type="email" required autoComplete="email" placeholder="you@example.com" defaultValue={defaults.email} error={errors.email} dir="ltr" />
          <FormField as="textarea" label={t("checkout.notes")} name="notes" rows={3} placeholder={t("checkout.notesPlaceholder")} className="sm:col-span-2" inputClassName="resize-none" maxLength={500} />
        </div>
      </section>

      <aside className="glass flex flex-col gap-5 rounded-3xl p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-semibold">{t("checkout.yourOrder")}</h2>
        <ul className="flex max-h-72 flex-col gap-3 overflow-y-auto">
          {cart.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-xl bg-surface">
                <ProductImage src={item.imageUrl} alt="" fill sizes="48px" className="object-cover" />
                <span className="absolute end-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-fg/70 px-1 text-[10px] font-semibold text-bg">{item.qty}</span>
              </div>
              <span className="line-clamp-2 flex-1 text-sm">{displayName(item.name)}</span>
              <span className="text-sm font-medium tabular-nums">{format.price(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>

        <OrderSummary totals={totals} />
        <CouponForm subtotal={totals.subtotal} />

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-[13px] font-medium">{t("checkout.payment")}</legend>
          <label className="flex items-center gap-3 rounded-2xl border border-brand bg-brand-soft p-3.5 text-sm">
            <input type="radio" name="payment" value="cod" defaultChecked className="h-4 w-4 accent-brand" />
            <LuBanknote aria-hidden className="text-lg text-brand" />
            {t("checkout.cod")}
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-line p-3.5 text-sm text-fg-muted">
            <input type="radio" name="payment" value="card" disabled className="h-4 w-4" />
            <LuCreditCard aria-hidden className="text-lg" />
            {t("checkout.card")}
            <span className="ms-auto rounded-full bg-fg/6 px-2 py-0.5 text-[11px]">{t("common.comingSoon")}</span>
          </label>
        </fieldset>

        <Button type="submit" size="lg" loading={placing} className="w-full">
          {t("checkout.placeOrder", { total: format.price(totals.total) })}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-fg-muted">
          <LuLock aria-hidden /> {t("checkout.secure")}
        </p>
      </aside>
    </form>
  );
}
