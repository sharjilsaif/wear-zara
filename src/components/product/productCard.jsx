"use client";

import { useState } from "react";
import Link from "next/link";
import { FaHeart } from "react-icons/fa6";
import { LuCheck, LuEye, LuHeart, LuShoppingBag, LuTrash2 } from "react-icons/lu";

import ProductImage from "@/components/product/productImage";
import QuickViewModal from "@/components/product/quickViewModal";
import useProductActions from "@/components/product/useProductActions";
import IconButton from "@/components/ui/iconButton";
import Price from "@/components/ui/price";
import Skeleton from "@/components/ui/skeleton";
import Stars from "@/components/ui/stars";
import { useI18n } from "@/i18n/client";
import { cn, displayName, getDiscountPercent } from "@/lib/format";
import { categoryName, primaryCategory } from "@/lib/site";

/**
 * The product tile used everywhere (home, shop, related products, wishlist).
 * Pass `onRemove` to show a remove button instead of the wishlist heart.
 */
export default function ProductCard({ product, priority = false, onRemove, className }) {
  const { t } = useI18n();
  const [quickView, setQuickView] = useState(null); // null = never opened (modal not mounted yet)
  const { inCart, inWishlist, addToCart, toggleWishlist } = useProductActions(product);

  const name = displayName(product.name);
  const href = `/product/${product.id}`;
  const discount = getDiscountPercent(product);
  const category = primaryCategory(product);

  return (
    <article className={cn("group/card relative flex min-w-0 flex-col", className)}>
      <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.04),0_6px_24px_rgb(0_0_0/0.05)] transition-all duration-500 ease-apple group-hover/card:-translate-y-1 group-hover/card:shadow-[0_2px_6px_rgb(0_0_0/0.06),0_18px_40px_rgb(0_0_0/0.1)]">
        <Link href={href} aria-label={name} className="absolute inset-0">
          <ProductImage
            src={product.imageUrl}
            alt={name}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 280px, (min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw"
            className="object-cover transition-transform duration-700 ease-apple group-hover/card:scale-[1.04]"
          />
        </Link>

        {discount ? (
          <span className="absolute start-3 top-3 rounded-full bg-sale px-2.5 py-1 text-[11px] font-semibold leading-none text-white shadow-sm">-{discount}%</span>
        ) : null}

        {/* Heart is always visible; quick view slides in on hover (always shown on touch screens). */}
        <div className="absolute end-3 top-3 flex flex-col gap-2">
          {onRemove ? (
            <CardAction label={t("product.removeFromWishlist")} onClick={onRemove} className="hover:text-sale">
              <LuTrash2 />
            </CardAction>
          ) : (
            <CardAction label={t(inWishlist ? "product.removeFromWishlist" : "product.addToWishlist")} aria-pressed={inWishlist} onClick={toggleWishlist} className="hover:text-sale">
              {inWishlist ? <FaHeart key="on" className="animate-pop text-sale" /> : <LuHeart key="off" />}
            </CardAction>
          )}
          <CardAction
            label={t("product.quickView")}
            onClick={() => setQuickView(true)}
            className="delay-75 pointer-fine:translate-x-3 pointer-fine:opacity-0 pointer-fine:group-hover/card:translate-x-0 pointer-fine:group-hover/card:opacity-100 pointer-fine:group-focus-within/card:translate-x-0 pointer-fine:group-focus-within/card:opacity-100 rtl:pointer-fine:-translate-x-3"
          >
            <LuEye />
          </CardAction>
        </div>

        <CartButton inCart={inCart} onAdd={() => addToCart()} label={t(inCart ? "product.inCart" : "product.addToCart")} />
      </div>

      <div className="mt-4 flex flex-col gap-1 px-1">
        {category && <p className="text-xs font-medium text-fg-muted">{categoryName(t, category)}</p>}
        <h3 className="line-clamp-1 text-[15px] font-semibold">
          <Link href={href} className="transition-colors hover:text-brand">
            {name}
          </Link>
        </h3>
        <Price product={product} />
        <Stars rating={product.rating} reviews={product.reviews} />
      </div>

      {quickView !== null && <QuickViewModal product={product} open={quickView} onClose={() => setQuickView(false)} />}
    </article>
  );
}

/** Frosted round button floating over the product photo. */
function CardAction({ label, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[17px] text-[#1d1d1f] shadow-[0_2px_8px_rgb(0_0_0/0.12)] ring-1 ring-black/5 backdrop-blur-md transition-all duration-300 ease-apple hover:scale-110 hover:bg-white active:scale-95",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** Touch: a round bag button. Mouse: a full-width pill that slides up on hover/focus. */
function CartButton({ inCart, onAdd, label }) {
  const classes =
    "absolute bottom-3 end-3 flex h-10 min-w-10 items-center justify-center gap-2 rounded-full bg-white/90 px-3 text-sm font-medium text-[#1d1d1f] shadow-[0_2px_10px_rgb(0_0_0/0.12)] backdrop-blur-md transition-all duration-300 ease-apple hover:bg-white active:scale-95 pointer-fine:start-3 pointer-fine:translate-y-3 pointer-fine:opacity-0 pointer-fine:group-hover/card:translate-y-0 pointer-fine:group-hover/card:opacity-100 pointer-fine:group-focus-within/card:translate-y-0 pointer-fine:group-focus-within/card:opacity-100";
  const content = (icon) => (
    <>
      {icon} <span className="hidden pointer-fine:inline">{label}</span>
    </>
  );

  return inCart ? (
    <Link href="/cart" aria-label={label} className={classes}>
      {content(<LuCheck className="text-success" />)}
    </Link>
  ) : (
    <button type="button" aria-label={label} onClick={onAdd} className={classes}>
      {content(<LuShoppingBag />)}
    </button>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="aspect-4/5 rounded-3xl" />
      <Skeleton className="mt-4 h-3 w-1/3 rounded-full" />
      <Skeleton className="mt-2.5 h-4 w-3/4 rounded-full" />
      <Skeleton className="mt-2.5 h-4 w-1/4 rounded-full" />
    </div>
  );
}
