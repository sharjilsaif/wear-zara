"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { LuHeart, LuMenu, LuShoppingBag, LuX } from "react-icons/lu";

import AccountMenu from "@/components/layout/accountMenu";
import LanguageMenu from "@/components/layout/languageMenu";
import SearchForm from "@/components/layout/searchForm";
import ThemeToggle from "@/components/layout/themeToggle";
import IconButton from "@/components/ui/iconButton";
import { useI18n, useLocalPath } from "@/i18n/client";
import { cn } from "@/lib/format";
import { NAV_LINKS, SITE, shopHref } from "@/lib/site";
import { useCart, useWishlist } from "@/lib/store";
import useMounted from "@/lib/useMounted";

const isActive = (pathname, href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

export default function Navbar() {
  const { t } = useI18n();
  const pathname = useLocalPath();
  const mounted = useMounted();
  const { status, data: session } = useSession();
  const isAdmin = Boolean(session?.user?.isAdmin); // admins run the store; they don't shop in it
  const cartCount = useCart().reduce((sum, item) => sum + item.qty, 0);
  const wishlistCount = useWishlist().length;

  // Open state is tied to the path, so the mobile menu closes after navigating.
  const [menuOpenOn, setMenuOpenOn] = useState(null);
  const menuOpen = menuOpenOn === pathname;
  const closeMenu = () => setMenuOpenOn(null);

  const links = NAV_LINKS.map((link) => ({ ...link, label: t(`nav.${link.key}`), active: mounted && isActive(pathname, link.href) }));
  const authLinks =
    status === "unauthenticated"
      ? [
          { href: "/login", label: t("nav.signIn") },
          { href: "/signup", label: t("nav.signUp") },
        ]
      : [];

  if (pathname.startsWith("/admin")) return null; // the admin console has its own top bar

  return (
    <header className="sticky top-0 z-40">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white">
        {t("nav.skip")}
      </a>

      <div className="bg-[#1d1d1f] text-white dark:border-b dark:border-line dark:bg-[#161617]">
        <p className="container-page flex h-9 items-center justify-center gap-2 truncate text-xs">
          <span className="truncate">{t("promo.text")}</span>
          <Link href={shopHref({ category: "swim-beachwear" })} className="shrink-0 font-semibold underline-offset-4 hover:underline">
            {t("promo.cta")} ›
          </Link>
        </p>
      </div>

      <nav aria-label={t("nav.main")} className="border-b border-line bg-glass backdrop-blur-xl backdrop-saturate-[1.8]">
        <div className="container-page flex h-14 items-center justify-between gap-3 lg:h-16">
          <div className="flex items-center gap-1">
            <IconButton
              label={t(menuOpen ? "nav.closeMenu" : "nav.openMenu")}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              variant="ghost"
              className="-ms-2 lg:hidden"
              onClick={() => setMenuOpenOn(menuOpen ? null : pathname)}
            >
              {menuOpen ? <LuX /> : <LuMenu />}
            </IconButton>
            <Link href="/" className="text-lg font-semibold tracking-tight sm:text-xl" aria-label={SITE.name}>
              Wear<span className="text-brand">Zara</span>
            </Link>
          </div>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  className={cn("rounded-full px-4 py-2 text-sm transition-colors hover:bg-fg/6", link.active ? "font-semibold text-fg" : "text-fg/75")}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <SearchForm className="me-1 hidden w-52 md:block xl:w-60" />
            <LanguageMenu className="hidden md:block" />
            <span className="hidden md:block">
              <ThemeToggle />
            </span>
            {!isAdmin && (
              <>
                <IconButton href="/wishlist" label={t("nav.wishlist")} variant="ghost" badge={mounted ? wishlistCount : 0}>
                  <LuHeart />
                </IconButton>
                <IconButton href="/cart" label={t("nav.cart")} variant="ghost" badge={mounted ? cartCount : 0}>
                  <LuShoppingBag />
                </IconButton>
              </>
            )}
            <div className="ms-1">
              <AccountMenu />
            </div>
          </div>
        </div>

        {/* Mobile menu — animates its height open/closed. */}
        <div id="mobile-menu" className={cn("grid transition-[grid-template-rows] duration-300 ease-apple lg:hidden", menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")} inert={!menuOpen}>
          <div className="overflow-hidden">
            <div className="container-page flex flex-col gap-4 border-t border-line pb-6 pt-4">
              <SearchForm className="md:hidden" onSearch={closeMenu} />
              <ul className="flex flex-col">
                {[...links, ...authLinks].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={link.active ? "page" : undefined}
                      className={cn("block rounded-xl px-3 py-3 text-[17px] transition-colors hover:bg-fg/5", link.active && "font-semibold text-brand")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-fg/4 p-3 md:hidden">
                <span className="text-sm font-medium">{t("theme.label")}</span>
                <ThemeToggle />
              </div>
              <LanguageMenu inline className="md:hidden" />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
