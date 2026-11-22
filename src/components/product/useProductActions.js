"use client";

import { useToast } from "@/components/ui/toast";
import { displayName } from "@/lib/format";
import { addToCart, toggleWishlist, useCart, useWishlist } from "@/lib/store";

/** Cart + wishlist state and actions (with toasts) for a single product. */
export default function useProductActions(product) {
  const toast = useToast();
  const cart = useCart();
  const wishlist = useWishlist();

  const inCart = cart.some((item) => item.id === product.id);
  const inWishlist = wishlist.some((item) => item.id === product.id);
  const name = displayName(product.name);

  return {
    inCart,
    inWishlist,
    addToCart(qty = 1) {
      addToCart(product, qty);
      toast({ title: "Added to cart", description: name, action: { label: "View cart", href: "/cart" } });
    },
    toggleWishlist() {
      const added = toggleWishlist(product);
      toast({
        type: added ? "success" : "info",
        title: added ? "Saved to wishlist" : "Removed from wishlist",
        description: name,
        action: added ? { label: "View wishlist", href: "/wishlist" } : undefined,
      });
    },
  };
}
