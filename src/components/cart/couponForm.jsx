"use client";

import { useState } from "react";
import { LuTicket, LuX } from "react-icons/lu";

import Button from "@/components/ui/button";
import { inputClasses } from "@/components/ui/formField";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";
import { setCoupon, useCoupon } from "@/lib/store";
import useRequest from "@/lib/useRequest";

/** Applies a coupon after the server validates it; the applied coupon is kept in the browser. */
export default function CouponForm({ subtotal }) {
  const { t, format } = useI18n();
  const toast = useToast();
  const applied = useCoupon();
  const { send, pending } = useRequest();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  if (applied) {
    const short = subtotal < applied.minSubtotal;
    return (
      <div className={cn("flex items-start justify-between gap-3 rounded-2xl border border-dashed p-3.5 text-sm", short ? "border-warning/50 bg-warning-soft" : "border-success/50 bg-success-soft")}>
        <div className="flex gap-2.5">
          <LuTicket aria-hidden className={cn("mt-0.5 shrink-0", short ? "text-warning" : "text-success")} />
          <div>
            <p className="font-semibold">{applied.code}</p>
            <p className="text-xs text-fg-muted">
              {short ? t("coupon.spendMore", { amount: format.price(applied.minSubtotal - subtotal) }) : applied.description || t("coupon.applied")}
            </p>
          </div>
        </div>
        <button type="button" aria-label={t("coupon.remove")} onClick={() => setCoupon(null)} className="rounded-full p-1 text-fg-muted transition-colors hover:bg-fg/6 hover:text-fg">
          <LuX />
        </button>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!code.trim()) return setError(t("coupon.errors.empty"));

    const result = await send("/api/coupons/validate", { body: { code, subtotal }, refresh: false, quiet: true });
    if (!result.ok) return setError(t(`coupon.errors.${result.reason ?? "invalid"}`));

    setCoupon(result.coupon);
    setCode("");
    setError("");
    toast({ title: t("coupon.appliedToast"), description: result.coupon.description ?? result.coupon.code });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="coupon" className="mb-2 block text-[13px] font-medium text-fg/85">
        {t("coupon.label")}
      </label>
      <div className="flex gap-2">
        <input
          id="coupon"
          value={code}
          onChange={(event) => (setCode(event.target.value), setError(""))}
          placeholder={t("coupon.placeholder")}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "coupon-error" : undefined}
          className={cn(inputClasses, "min-w-0 flex-1 py-2.5 uppercase placeholder:normal-case", error && "border-sale/60")}
        />
        <Button type="submit" variant="dark" loading={pending}>
          {t("coupon.apply")}
        </Button>
      </div>
      {error && (
        <p id="coupon-error" className="mt-2 animate-fade-up text-xs text-sale">
          {error}
        </p>
      )}
    </form>
  );
}
