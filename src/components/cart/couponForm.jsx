"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";

import Button from "@/components/ui/button";
import { inputClasses } from "@/components/ui/formField";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/format";
import { COUPONS } from "@/lib/site";
import { setCoupon, useCoupon } from "@/lib/store";

export default function CouponForm() {
  const toast = useToast();
  const applied = useCoupon();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  if (applied && COUPONS[applied]) {
    return (
      <div className="flex items-center justify-between rounded-md border border-dashed border-green-500 bg-green-50 px-4 py-3 text-sm dark:bg-green-950/30">
        <span>
          <strong>{applied}</strong> — {COUPONS[applied].label}
        </span>
        <button type="button" aria-label="Remove coupon" onClick={() => setCoupon(null)} className="text-fg-muted hover:text-fg">
          <FiX />
        </button>
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (!COUPONS[normalized]) {
      setError("That coupon code isn't valid. Try WELCOME10.");
      return;
    }
    setCoupon(normalized);
    setCode("");
    setError("");
    toast({ title: "Coupon applied", description: COUPONS[normalized].label });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex gap-2">
        <label htmlFor="coupon" className="sr-only">
          Coupon code
        </label>
        <input
          id="coupon"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError("");
          }}
          placeholder="Coupon code"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "coupon-error" : undefined}
          className={cn(inputClasses, "min-w-0 flex-1 uppercase placeholder:normal-case", error ? "border-red-400" : "border-line")}
        />
        <Button type="submit" variant="dark">
          Apply
        </Button>
      </div>
      {error && (
        <p id="coupon-error" className="mt-2 text-xs text-red-500">
          {error}
        </p>
      )}
    </form>
  );
}
