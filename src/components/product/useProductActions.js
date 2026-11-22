"use client";

import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/i18n/client";
import { displayName } from "@/lib/format";
import { addToCart, toggleWishlist, useCart, useWishlist } from "@/lib/store";

/** Cart + wishlist state and actions (with toasts) for one product. */
export default function useProductActions(product) {
  const { t } = useI18n();
  const toast = useToast();
  const inCart = useCart().some((item) => item.id === product.id);
  const inWishlist = useWishlist().some((item) => item.id === product.id);
  const name = displayName(product.name);

  return {
    inCart,
    inWishlist,
    addToCart(qty = 1) {
      addToCart(product, qty);
      toast({ title: t("toast.addedToCart"), description: name, action: { label: t("toast.viewCart"), href: "/cart" } });
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
