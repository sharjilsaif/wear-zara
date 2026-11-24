"use client";

import { useState } from "react";
import { LuArrowLeft, LuShoppingBag } from "react-icons/lu";

import CartLineItem from "@/components/cart/cartLineItem";
import CouponForm from "@/components/cart/couponForm";
import OrderSummary from "@/components/cart/orderSummary";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/emptyState";
import { ConfirmDialog } from "@/components/ui/modal";
import Skeleton from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/client";
import { getCartTotals } from "@/lib/pricing";
import { clearCart, useCart, useCoupon } from "@/lib/store";
import useMounted from "@/lib/useMounted";
import useRedirectAdmin from "@/lib/useRedirectAdmin";

export default function CartView() {
  const { t } = useI18n();
  const mounted = useMounted();
  const cart = useCart();
  const coupon = useCoupon();
  const [confirmClear, setConfirmClear] = useState(false);
  const redirecting = useRedirectAdmin();

  if (!mounted || redirecting) return <Skeleton className="h-96 w-full rounded-3xl" />;

  if (cart.length === 0) {
    return (
      <EmptyState icon={LuShoppingBag} title={t("cart.emptyTitle")} description={t("cart.emptyText")}>
        <Button href="/shop" size="lg">
          {t("common.continueShopping")}
        </Button>
      </EmptyState>
    );
  }

  const totals = getCartTotals(cart, coupon);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
      <div>
        <div className="mb-6 flex items-end justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">{t("cart.title")}</h1>
          <p className="text-sm text-fg-muted">{t("cart.itemCount", { count: totals.itemCount })}</p>
        </div>

        <ul className="flex flex-col gap-3">
          {cart.map((item) => (
            <CartLineItem key={item.id} item={item} />
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Button href="/shop" variant="ghost">
            <LuArrowLeft className="rtl:-scale-x-100" /> {t("common.continueShopping")}
          </Button>
          <Button variant="danger-soft" onClick={() => setConfirmClear(true)}>
            {t("cart.clear")}
          </Button>
        </div>
      </div>

      <aside className="glass flex flex-col gap-5 rounded-3xl p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-semibold">{t("cart.summary")}</h2>
        <OrderSummary totals={totals} />
        <CouponForm subtotal={totals.subtotal} />
        <Button href="/checkout" size="lg" className="w-full">
          {t("cart.checkout")}
        </Button>
      </aside>

      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={() => (clearCart(), setConfirmClear(false))}
        title={t("cart.clearTitle")}
        description={t("cart.clearText")}
        confirmLabel={t("cart.clear")}
      />
    </div>
  );
}
