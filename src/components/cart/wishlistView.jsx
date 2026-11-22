"use client";

import { GoHeart } from "react-icons/go";

import ProductGrid, { ProductGridSkeleton } from "@/components/product/productGrid";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/emptyState";
import { useToast } from "@/components/ui/toast";
import { addToCart, clearWishlist, removeFromWishlist, useWishlist } from "@/lib/store";
import useMounted from "@/lib/useMounted";

export default function WishlistView() {
  const mounted = useMounted();
  const wishlist = useWishlist();
  const toast = useToast();

  if (!mounted) return <ProductGridSkeleton count={4} />;

  if (wishlist.length === 0) {
    return (
      <EmptyState icon={GoHeart} title="Your wishlist is empty" description="Tap the heart on any product to save it here for later.">
        <Button href="/shop">Discover Products</Button>
      </EmptyState>
    );
  }

  const moveAllToCart = () => {
    wishlist.forEach((item) => addToCart(item, 1));
    clearWishlist();
    toast({ title: "Moved to cart", description: `${wishlist.length} item(s) added to your cart.`, action: { label: "View cart", href: "/cart" } });
  };

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold sm:text-2xl">Wishlist ({wishlist.length})</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={clearWishlist}>
            Clear All
          </Button>
          <Button onClick={moveAllToCart}>Move All to Cart</Button>
        </div>
      </div>

      <ProductGrid products={wishlist} onRemove={(item) => removeFromWishlist(item.id)} />
    </>
  );
}
