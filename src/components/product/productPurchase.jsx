"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa6";
import { LuHeart } from "react-icons/lu";

import useProductActions from "@/components/product/useProductActions";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/iconButton";
import QuantityStepper from "@/components/ui/quantityStepper";
import { useI18n } from "@/i18n/client";

/** Quantity + Add to bag / Buy now / wishlist on the product page. */
export default function ProductPurchase({ product }) {
  const { t } = useI18n();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const { inWishlist, addToCart, toggleWishlist } = useProductActions(product);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <QuantityStepper value={qty} onChange={setQty} />
      <Button variant="secondary" size="lg" className="min-w-36 flex-1 sm:flex-none" onClick={() => addToCart(qty)}>
        {t("product.addToCart")}
      </Button>
      <Button size="lg" className="min-w-36 flex-1 sm:flex-none" onClick={() => (addToCart(qty), router.push("/checkout"))}>
        {t("product.buyNow")}
      </Button>
      <IconButton label={t(inWishlist ? "product.removeFromWishlist" : "product.addToWishlist")} aria-pressed={inWishlist} size="lg" onClick={toggleWishlist}>
        {inWishlist ? <FaHeart className="animate-pop text-sale" /> : <LuHeart />}
      </IconButton>
    </div>
  );
}
