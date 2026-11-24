"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/** Shopper-only pages (bag, wishlist) send admins to the admin console. Returns true while redirecting. */
export default function useRedirectAdmin() {
  const router = useRouter();
  const isAdmin = Boolean(useSession().data?.user?.isAdmin);
  useEffect(() => {
    if (isAdmin) router.replace("/admin");
  }, [isAdmin, router]);
  return isAdmin;
}
