"use client";

import { useState } from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { FiCheck, FiTrash2 } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";

import ProductImage from "@/components/product/productImage";
import QuickViewModal from "@/components/product/quickViewModal";
import useProductActions from "@/components/product/useProductActions";
import IconButton from "@/components/ui/iconButton";
import Price from "@/components/ui/price";
import Skeleton from "@/components/ui/skeleton";
import Stars from "@/components/ui/stars";
import { cn, displayName, getDiscountPercent } from "@/lib/format";

/**
 * The product tile used everywhere (home sections, shop, related products, wishlist).
 * Pass `onRemove` to show a remove button instead of the wishlist heart.
 */
export default function ProductCard({ product, priority = false, onRemove, className }) {
  const [quickView, setQuickView] = useState(false);
  const { inCart, inWishlist, addToCart, toggleWishlist } = useProductActions(product);

  const name = displayName(product.name);
  const href = `/product/${product.id}`;
  const discount = getDiscountPercent(product);

  return (
    <article className={cn("group/card relative flex min-w-0 flex-col", className)}>
      <div className="relative aspect-4/5 overflow-hidden rounded-xl border border-line bg-surface-muted">
        <Link href={href} aria-label={name} className="absolute inset-0">
          <ProductImage
            src={product.imageUrl}
            alt={name}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 280px, (min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw"
            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
          />
        </Link>

        {discount ? (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-brand px-2 py-1 text-[11px] font-semibold leading-none text-white">
            -{discount}%
          </span>
        ) : null}

        <div className="absolute right-2.5 top-2.5 flex flex-col gap-2">
          {onRemove ? (
            <IconButton label={`Remove ${name} from wishlist`} variant="floating" size="sm" onClick={onRemove}>
              <FiTrash2 />
            </IconButton>
          ) : (
            <IconButton
              label={inWishlist ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
              aria-pressed={inWishlist}
              variant="floating"
              size="sm"
              onClick={toggleWishlist}
            >
              {inWishlist ? <FaHeart className="text-brand" /> : <FaRegHeart />}
            </IconButton>
          )}
          <IconButton label={`Quick view ${name}`} variant="floating" size="sm" onClick={() => setQuickView(true)}>
            <IoEyeOutline />
          </IconButton>
        </div>

        {/* Always visible on touch screens; slides in on hover/focus for mouse users. */}
        {inCart ? (
          <Link
            href="/cart"
            className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-inverse py-2.5 text-xs font-medium text-inverse-fg transition-all duration-300 sm:text-sm pointer-fine:translate-y-full pointer-fine:group-hover/card:translate-y-0 pointer-fine:group-focus-within/card:translate-y-0"
          >
            <FiCheck aria-hidden /> In cart · View
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => addToCart()}
            className="absolute inset-x-0 bottom-0 bg-inverse py-2.5 text-xs font-medium text-inverse-fg transition-all duration-300 hover:opacity-90 sm:text-sm pointer-fine:translate-y-full pointer-fine:group-hover/card:translate-y-0 pointer-fine:group-focus-within/card:translate-y-0"
          >
            Add to Cart
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <h3 className="line-clamp-1 text-sm font-medium sm:text-base">
          <Link href={href} className="transition-colors hover:text-brand">
            {name}
          </Link>
        </h3>
        <Price product={product} />
        <Stars rating={product.rating} reviews={product.reviews} />
      </div>

      <QuickViewModal product={product} open={quickView} onClose={() => setQuickView(false)} />
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="aspect-4/5 rounded-xl" />
      <Skeleton className="mt-4 h-4 w-3/4 rounded-full" />
      <Skeleton className="mt-3 h-4 w-1/3 rounded-full" />
      <Skeleton className="mt-3 h-3 w-1/2 rounded-full" />
    </div>
  );
}
