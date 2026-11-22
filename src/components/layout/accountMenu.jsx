"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FaRegUser } from "react-icons/fa6";
import { FiGrid, FiLogOut, FiTrash2 } from "react-icons/fi";

import IconButton from "@/components/ui/iconButton";
import { ConfirmDialog } from "@/components/ui/modal";
import Skeleton from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/format";

/** Avatar button + dropdown for signed-in users; "Log in" link otherwise. */
export default function AccountMenu() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const toast = useToast();
  const menuRef = useRef(null);

  // Tie the open state to the current path so navigating closes the menu.
  const [openOn, setOpenOn] = useState(null);
  const open = openOn === pathname;
  const close = () => setOpenOn(null);

  const [dialog, setDialog] = useState(null); // "logout" | "delete" | null
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpenOn(null);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpenOn(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (status === "loading") return <Skeleton className="h-9 w-9 rounded-full" />;

  if (!session?.user) {
    return (
      <IconButton href="/login" label="Log in" variant="ghost" className="lg:hidden">
        <FaRegUser className="text-lg" />
      </IconButton>
    );
  }

  const { name, email, isAdmin } = session.user;
  const initial = (name || email || "?").charAt(0).toUpperCase();

  const handleLogout = async () => {
    setBusy(true);
    await signOut({ redirectTo: "/" });
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/user", { method: "DELETE" });
      if (!response.ok) throw new Error("Request failed");
      await signOut({ redirectTo: "/" });
    } catch {
      setBusy(false);
      setDialog(null);
      toast({ type: "error", title: "Could not delete account", description: "Please try again in a moment." });
    }
  };

  const itemClasses =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-muted";

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpenOn(open ? null : pathname)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white transition-transform active:scale-95"
      >
        {initial}
      </button>

      <div
        role="menu"
        className={cn(
          "absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 rounded-2xl border border-line bg-surface-raised p-2 shadow-xl transition-all duration-200",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        <div className="mb-1 rounded-xl bg-surface-muted px-3 py-3">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-fg-muted">{email}</p>
        </div>

        {isAdmin && (
          <Link role="menuitem" href="/admin" className={itemClasses} onClick={close}>
            <FiGrid aria-hidden /> Admin dashboard
          </Link>
        )}
        <button role="menuitem" type="button" className={itemClasses} onClick={() => { close(); setDialog("logout"); }}>
          <FiLogOut aria-hidden /> Log out
        </button>
        <button role="menuitem" type="button" className={cn(itemClasses, "text-brand")} onClick={() => { close(); setDialog("delete"); }}>
          <FiTrash2 aria-hidden /> Delete account
        </button>
      </div>

      <ConfirmDialog
        open={dialog === "logout"}
        onClose={() => setDialog(null)}
        onConfirm={handleLogout}
        loading={busy}
        title="Log out?"
        description="You can log back in at any time. Your cart and wishlist stay saved on this device."
        confirmLabel="Log out"
        cancelLabel="Stay logged in"
        tone="primary"
      />
      <ConfirmDialog
        open={dialog === "delete"}
        onClose={() => setDialog(null)}
        onConfirm={handleDelete}
        loading={busy}
        title="Delete your account?"
        description="This permanently deletes your Wear Zara account. This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
