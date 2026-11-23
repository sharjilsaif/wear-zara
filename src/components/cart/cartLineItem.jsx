"use client";

import Link from "next/link";
import { LuTrash2 } from "react-icons/lu";

import ProductImage from "@/components/product/productImage";
import IconButton from "@/components/ui/iconButton";
import QuantityStepper from "@/components/ui/quantityStepper";
import { useI18n } from "@/i18n/client";
import { displayName } from "@/lib/format";
import { maxQty, removeFromCart, setCartQty } from "@/lib/store";

/** One cart row: image, name, unit price, quantity, line total, remove. */
export default function CartLineItem({ item }) {
  const { t, format } = useI18n();
  const name = displayName(item.name);

  return (
    <li className="glass flex animate-fade-up gap-4 rounded-3xl p-3 sm:items-center sm:p-4">
      <Link href={`/product/${item.id}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-surface sm:h-28 sm:w-24">
        <ProductImage src={item.imageUrl} alt={name} fill sizes="96px" className="object-cover" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Link href={`/product/${item.id}`} className="line-clamp-2 text-[15px] font-semibold transition-colors hover:text-brand">
            {name}
          </Link>
          <p className="mt-1 text-sm text-fg-muted">{format.price(item.price)}</p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <QuantityStepper value={item.qty} onChange={(qty) => setCartQty(item, qty)} max={maxQty(item)} size="sm" label={t("cart.quantityOf", { name })} />
          <span className="w-20 text-end text-[15px] font-semibold tabular-nums">{format.price(item.price * item.qty)}</span>
          <IconButton label={t("cart.remove", { name })} variant="ghost" size="sm" className="hover:text-sale" onClick={() => removeFromCart(item)}>
            <LuTrash2 />
          </IconButton>
        </div>
      </div>
    </li>
  );
}
