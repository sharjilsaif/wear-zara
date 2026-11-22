"use client";

import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";

import ProductImage from "@/components/product/productImage";
import IconButton from "@/components/ui/iconButton";
import QuantityStepper from "@/components/ui/quantityStepper";
import { displayName, formatPrice } from "@/lib/format";
import { removeFromCart, setCartQty } from "@/lib/store";

/** One row in the cart (stacked on mobile, table-like on larger screens). */
export default function CartLineItem({ item }) {
  const name = displayName(item.name);

  return (
    <li className="grid grid-cols-[5rem_1fr] items-center gap-4 rounded-xl border border-line bg-surface-raised p-4 shadow-sm sm:grid-cols-[2fr_1fr_1fr_1fr] sm:px-6">
      <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-surface-muted sm:hidden">
        <ProductImage src={item.imageUrl} alt={name} fill sizes="80px" className="object-cover" />
      </div>

      <div className="flex min-w-0 items-center gap-4">
        <div className="relative hidden h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted sm:block">
          <ProductImage src={item.imageUrl} alt={name} fill sizes="64px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <Link href={`/product/${item.id}`} className="line-clamp-2 text-sm font-medium hover:text-brand">
            {name}
          </Link>
          <p className="mt-1 text-sm text-fg-muted sm:hidden">{formatPrice(item.price)}</p>
        </div>
      </div>

      <p className="hidden text-center text-sm sm:block">{formatPrice(item.price)}</p>

      <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:justify-center">
        <QuantityStepper value={item.qty} onChange={(qty) => setCartQty(item.id, qty)} size="sm" label={`Quantity of ${name}`} />
        <div className="flex items-center gap-2 sm:hidden">
          <span className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</span>
          <IconButton label={`Remove ${name}`} variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
            <FiTrash2 />
          </IconButton>
        </div>
      </div>

      <div className="hidden items-center justify-end gap-3 sm:flex">
        <span className="text-sm font-semibold tabular-nums">{formatPrice(item.price * item.qty)}</span>
        <IconButton label={`Remove ${name}`} variant="ghost" size="sm" className="hover:text-brand" onClick={() => removeFromCart(item.id)}>
          <FiTrash2 />
        </IconButton>
      </div>
    </li>
  );
}
