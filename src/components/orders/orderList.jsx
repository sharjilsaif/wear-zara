"use client";

import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

import { StatusBadge } from "@/components/orders/orderStatus";
import ProductImage from "@/components/product/productImage";
import DateText from "@/components/ui/dateText";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";

/** Order cards linking to `${baseHref}/${number}`. */
export default function OrderList({ orders, baseHref = "/account/orders" }) {
  const { t, format } = useI18n();

  return (
    <ul className="flex flex-col gap-3">
      {orders.map((order) => (
        <li key={order.id}>
          <Link href={`${baseHref}/${order.number}`} className="glass group flex items-center gap-4 rounded-3xl p-4 transition-all duration-300 ease-apple hover:-translate-y-0.5 hover:bg-glass-strong sm:p-5">
            <div className="flex shrink-0 -space-x-4 rtl:space-x-reverse">
              {order.items.map((item, index) => (
                <span key={index} className={cn("relative h-14 w-12 overflow-hidden rounded-xl bg-surface ring-2 ring-bg", index > 0 && "hidden sm:block")}>
                  <ProductImage src={item.imageUrl} alt="" fill sizes="48px" className="object-cover" />
                </span>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold whitespace-nowrap" dir="ltr">
                  {order.number}
                </span>
                <StatusBadge status={order.status} />
              </div>
              <p className="mt-1 text-[13px] text-fg-muted">
                <DateText value={order.createdAt} /> · {t("orders.items", { count: order._count.items })}
              </p>
            </div>
            <span className="font-semibold tabular-nums">{format.price(order.total)}</span>
            <LuChevronRight aria-hidden className="shrink-0 text-fg-muted transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
