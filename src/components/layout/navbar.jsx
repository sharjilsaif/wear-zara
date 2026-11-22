"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { GoHeart } from "react-icons/go";
import { FiMenu, FiX } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";

import AccountMenu from "@/components/layout/accountMenu";
import SearchForm from "@/components/layout/searchForm";
import ThemeToggle from "@/components/layout/themeToggle";
import IconButton from "@/components/ui/iconButton";
import { cn } from "@/lib/format";
import { NAV_LINKS, shopHref } from "@/lib/site";
import { useCart, useWishlist } from "@/lib/store";

function isActive(pathname, href) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const { status } = useSession();
  const cartCount = useCart().reduce((sum, item) => sum + item.qty, 0);
  const wishlistCount = useWishlist().length;

  // Open state is tied to the path, so the mobile menu closes after navigating.
  const [menuOpenOn, setMenuOpenOn] = useState(null);
  const menuOpen = menuOpenOn === pathname;
  const closeMenu = () => setMenuOpenOn(null);

  const guestLinks =
    status === "unauthenticated"
      ? [
          { href: "/signup", label: "Sign Up" },
          { href: "/login", label: "Log In" },
        ]
      : [];

  return (
    <header className="sticky top-0 z-40">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* Promo bar */}
      <div className="bg-black text-white">
        <div className="container-page flex h-10 items-center justify-center gap-4 text-xs sm:text-sm md:justify-between">
          <span className="hidden w-11 md:block" aria-hidden />
          <p className="truncate text-center">
            Summer Sale on all Swimwear — up to 50% off with free delivery{" "}
            <Link href={shopHref({ category: "swim-beachwear" })} className="ml-1 font-semibold underline underline-offset-2 hover:text-neutral-300">
              Shop Now
            </Link>
          </p>
          <ThemeToggle className="hidden md:inline-flex" />
        </div>
      </div>

      <nav aria-label="Main" className="border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link href="/" className="shrink-0 text-xl font-bold tracking-tight sm:text-2xl">
            Wear Zara
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {[...NAV_LINKS, ...guestLinks].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  className={cn(
                    "border-b-2 pb-0.5 text-[15px] font-medium transition-colors hover:border-fg/40",
                    isActive(pathname, link.href) ? "border-brand" : "border-transparent",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1 sm:gap-2">
            <SearchForm className="mr-2 hidden w-56 md:block xl:w-64" />
            <IconButton href="/wishlist" label="Wishlist" variant="ghost" badge={wishlistCount}>
              <GoHeart />
            </IconButton>
            <IconButton href="/cart" label="Cart" variant="ghost" badge={cartCount}>
              <IoCartOutline className="text-2xl" />
            </IconButton>
            <AccountMenu />
            <IconButton
              label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setMenuOpenOn(menuOpen ? null : pathname)}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </IconButton>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="container-page border-t border-line pb-6 pt-4 lg:hidden">
            <SearchForm className="mb-4 md:hidden" onSearch={closeMenu} />
            <ul className="flex flex-col">
              {[...NAV_LINKS, ...guestLinks].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={isActive(pathname, link.href) ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-surface-muted",
                      isActive(pathname, link.href) && "text-brand",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-center justify-between rounded-lg bg-black px-3 py-3 text-sm font-medium text-white">
              Dark mode
              <ThemeToggle />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
