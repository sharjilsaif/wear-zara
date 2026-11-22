"use client";

import { LuHeart } from "react-icons/lu";

import ProductGrid, { ProductGridSkeleton } from "@/components/product/productGrid";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/emptyState";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/i18n/client";
import { addToCart, clearWishlist, toggleWishlist, useWishlist } from "@/lib/store";
import useMounted from "@/lib/useMounted";

export default function WishlistView() {
  const { t } = useI18n();
  const mounted = useMounted();
  const wishlist = useWishlist();
  const toast = useToast();

  if (!mounted) return <ProductGridSkeleton count={4} />;

  if (wishlist.length === 0) {
    return (
      <EmptyState icon={LuHeart} title={t("wishlist.emptyTitle")} description={t("wishlist.emptyText")}>
        <Button href="/shop" size="lg">
          {t("wishlist.discover")}
        </Button>
      </EmptyState>
    );
  }

  const moveAllToCart = () => {
    wishlist.forEach((item) => addToCart(item, 1));
    clearWishlist();
    toast({ title: t("wishlist.moved", { count: wishlist.length }), action: { label: t("toast.viewCart"), href: "/cart" } });
  };

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("wishlist.title")}</h1>
          <p className="mt-1 text-sm text-fg-muted">{t("wishlist.count", { count: wishlist.length })}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={clearWishlist}>
            {t("wishlist.clear")}
          </Button>
          <Button onClick={moveAllToCart}>{t("wishlist.moveAll")}</Button>
        </div>
      </div>

      <ProductGrid products={wishlist} onRemove={(item) => toggleWishlist(item)} />
    </>
  );
}
