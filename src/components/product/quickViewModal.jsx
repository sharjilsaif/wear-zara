"use client";

import { useState } from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa6";

import ProductImage from "@/components/product/productImage";
import useProductActions from "@/components/product/useProductActions";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/iconButton";
import Modal from "@/components/ui/modal";
import Price from "@/components/ui/price";
import QuantityStepper from "@/components/ui/quantityStepper";
import Stars from "@/components/ui/stars";
import { displayName } from "@/lib/format";

export default function QuickViewModal({ product, open, onClose }) {
  const [qty, setQty] = useState(1);
  const { inWishlist, addToCart, toggleWishlist } = useProductActions(product);
  const name = displayName(product.name);

  return (
    <Modal open={open} onClose={onClose} title={name} hideTitle className="max-w-3xl">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-surface-muted">
          <ProductImage src={product.imageUrl} alt={name} fill sizes="(min-width: 640px) 360px, 90vw" className="object-cover" />
        </div>

        <div className="flex flex-col gap-4 sm:py-4">
          <h2 className="pr-8 text-xl font-semibold sm:text-2xl">{name}</h2>
          <Stars rating={product.rating} reviews={product.reviews} />
          <Price product={product} size="lg" />
          <p className="text-sm leading-6 text-fg-muted">
            A Wear Zara favourite crafted for everyday comfort and effortless style. Free delivery on orders over $140
            and easy 30-day returns.
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} onChange={setQty} />
            <Button
              className="flex-1"
              onClick={() => {
                addToCart(qty);
                onClose();
              }}
            >
              Add to Cart
            </Button>
            <IconButton
              label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={inWishlist}
              size="lg"
              className="border border-line bg-surface"
              onClick={toggleWishlist}
            >
              {inWishlist ? <FaHeart className="text-brand" /> : <FaRegHeart />}
            </IconButton>
          </div>

          <Link href={`/product/${product.id}`} className="text-sm font-medium text-brand hover:underline" onClick={onClose}>
            View full details →
          </Link>
        </div>
      </div>
    </Modal>
  );
}
