"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa6";

import useProductActions from "@/components/product/useProductActions";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/iconButton";
import QuantityStepper from "@/components/ui/quantityStepper";

/** Quantity + Add to cart / Buy now / wishlist controls on the product page. */
export default function ProductPurchase({ product }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const { inWishlist, addToCart, toggleWishlist } = useProductActions(product);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <QuantityStepper value={qty} onChange={setQty} />
      <Button variant="dark" className="min-w-36 flex-1 sm:flex-none" onClick={() => addToCart(qty)}>
        Add to Cart
      </Button>
      <Button
        className="min-w-36 flex-1 sm:flex-none"
        onClick={() => {
          addToCart(qty);
          router.push("/checkout");
        }}
      >
        Buy Now
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
  );
}
