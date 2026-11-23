"use client";

import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/i18n/client";
import { displayName } from "@/lib/format";
import { addToCart, maxQty, toggleWishlist, useCart, useWishlist } from "@/lib/store";

/** Cart + wishlist state and actions (with toasts) for one product. */
export default function useProductActions(product) {
  const { t } = useI18n();
  const toast = useToast();
  const cartItem = useCart().find((item) => item.id === product.id);
  const inCart = Boolean(cartItem);
  const soldOut = product.stock === 0;
  const inWishlist = useWishlist().some((item) => item.id === product.id);
  const name = displayName(product.name);

  return {
    inCart,
    inWishlist,
    soldOut,
    maxQty: maxQty(product),
    addToCart(qty = 1) {
      if (soldOut) return toast({ type: "error", title: t("product.outOfStock"), description: name });
      const limited = (cartItem?.qty ?? 0) + qty > maxQty(product);
      addToCart(product, qty); // the store clamps to the limit
      toast(
        limited
          ? { type: "info", title: t("product.limitReached", { count: maxQty(product) }), description: name, action: { label: t("toast.viewCart"), href: "/cart" } }
          : { title: t("toast.addedToCart"), description: name, action: { label: t("toast.viewCart"), href: "/cart" } },
      );
    },
    toggleWishlist() {
      const added = toggleWishlist(product);
      toast({
        type: added ? "success" : "info",
        title: t(added ? "toast.savedToWishlist" : "toast.removedFromWishlist"),
        description: name,
        action: added ? { label: t("toast.viewWishlist"), href: "/wishlist" } : undefined,
      });
    },
  };
}
