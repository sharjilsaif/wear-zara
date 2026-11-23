"use client";

import { useState } from "react";
import Link from "next/link";
import { FaHeart } from "react-icons/fa6";
import { LuArrowRight, LuHeart, LuRotateCcw, LuTruck } from "react-icons/lu";

import ProductImage from "@/components/product/productImage";
import StockStatus from "@/components/product/stockStatus";
import useProductActions from "@/components/product/useProductActions";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/iconButton";
import Modal from "@/components/ui/modal";
import Price from "@/components/ui/price";
import QuantityStepper from "@/components/ui/quantityStepper";
import Stars from "@/components/ui/stars";
import { useI18n } from "@/i18n/client";
import { displayName, getDiscountPercent } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, RETURN_DAYS, categoryName, primaryCategory } from "@/lib/site";

/** Product preview: photo fills the left half, details on the right (stacked bottom sheet on phones). */
export default function QuickViewModal({ product, open, onClose }) {
  const { t, format } = useI18n();
  const [qty, setQty] = useState(1);
  const { inWishlist, soldOut, maxQty, addToCart, toggleWishlist } = useProductActions(product);
  const name = displayName(product.name);
  const category = primaryCategory(product);
  const discount = getDiscountPercent(product);

  const perks = [
    { icon: LuTruck, text: t("product.freeDeliveryOver", { amount: format.price(FREE_SHIPPING_THRESHOLD) }) },
    { icon: LuRotateCcw, text: t("product.returns", { days: RETURN_DAYS }) },
  ];

  return (
    <Modal open={open} onClose={onClose} title={name} hideTitle bare size="xl">
      <div className="grid sm:grid-cols-2">
        <div className="relative aspect-4/3 bg-surface sm:aspect-auto sm:min-h-[36rem]">
          <ProductImage src={product.imageUrl} alt={name} fill sizes="(min-width: 1024px) 35vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
          {discount ? <span className="absolute start-4 top-4 rounded-full bg-sale px-3 py-1 text-xs font-semibold text-white shadow-sm">-{discount}%</span> : null}
        </div>

        <div className="flex flex-col gap-5 p-6 sm:p-8 lg:p-10">
          <div className="pe-10">
            {category && <p className="mb-2 text-[13px] font-semibold text-brand">{categoryName(t, category)}</p>}
            <h2 className="text-2xl font-semibold leading-tight tracking-tight lg:text-3xl">{name}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <Stars rating={product.rating} reviews={product.reviews} />
              <span aria-hidden className="h-4 w-px bg-line-strong" />
              <StockStatus stock={product.stock} />
            </div>
          </div>

          <Price product={product} size="lg" />

          <ul className="grid gap-2 sm:grid-cols-2">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 rounded-2xl bg-fg/4 p-3 text-[13px]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Icon aria-hidden />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-4 border-t border-line pt-5">
            <div className="flex items-center gap-3">
              {!soldOut && <QuantityStepper value={Math.min(qty, maxQty)} onChange={setQty} max={maxQty} />}
              <Button size="lg" className="flex-1" disabled={soldOut} onClick={() => (addToCart(qty), onClose())}>
                {t(soldOut ? "product.outOfStock" : "product.addToCart")}
              </Button>
              <IconButton label={t(inWishlist ? "product.removeFromWishlist" : "product.addToWishlist")} aria-pressed={inWishlist} size="lg" onClick={toggleWishlist}>
                {inWishlist ? <FaHeart className="animate-pop text-sale" /> : <LuHeart />}
              </IconButton>
            </div>
            <Link href={`/product/${product.id}`} onClick={onClose} className="group inline-flex w-fit items-center gap-1.5 text-sm font-medium text-link">
              {t("product.viewDetails")}
              <LuArrowRight className="transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
