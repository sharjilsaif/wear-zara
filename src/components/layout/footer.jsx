"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { LuGithub, LuMail, LuMapPin, LuPhone } from "react-icons/lu";

import { openCookieSettings } from "@/components/layout/cookieConsent";
import NewsletterForm from "@/components/layout/newsletterForm";
import { useI18n, useLocalPath } from "@/i18n/client";
import { SHOP_CATEGORIES, SITE, categoryName, contactChannels, shopHref } from "@/lib/site";

export default function Footer() {
  const { t } = useI18n();
  const pathname = useLocalPath();
  const isAdmin = Boolean(useSession().data?.user?.isAdmin);

  const columns = [
    {
      title: t("footer.shop"),
      links: [
        { href: "/shop", label: t("footer.allProducts") },
        { href: shopHref({ category: "flash-sales" }), label: t("categories.flash-sales") },
        ...SHOP_CATEGORIES.slice(0, 4).map((category) => ({ href: shopHref({ category: category.slug }), label: categoryName(t, category) })),
      ],
    },
    {
      title: t("footer.help"),
      links: [
        { href: "/track-order", label: t("pages.trackOrder.title") },
        { href: "/shipping", label: t("pages.shipping.title") },
        { href: "/returns", label: t("pages.returns.title") },
        { href: "/size-guide", label: t("pages.sizeGuide.title") },
        { href: "/faq", label: t("nav.faq") },
        { href: "/contact", label: t("nav.contact") },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { href: "/about", label: t("nav.about") },
        { href: "/account", label: t("account.title") },
        ...(isAdmin ? [{ href: "/admin", label: t("admin.title") }] : [{ href: "/account/orders", label: t("account.orders") }]),
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { href: "/privacy", label: t("pages.privacy.title") },
        { href: "/terms", label: t("pages.terms.title") },
        { href: "/cookies", label: t("pages.cookies.title") },
        { onClick: openCookieSettings, label: t("footer.cookieSettings") },
      ],
    },
  ];

  const icons = { address: LuMapPin, email: LuMail, phone: LuPhone };
  const contact = contactChannels().map((channel) => ({ ...channel, icon: icons[channel.kind] }));

  const linkClasses = "text-start transition-colors hover:text-fg";
  if (pathname.startsWith("/admin")) return null; // the admin console has its own layout

  return (
    <footer className="mt-24 border-t border-line bg-glass backdrop-blur-xl">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:gap-8">
        <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Wear<span className="text-brand">Zara</span>
          </Link>
          <p className="max-w-72 text-sm text-fg-muted">{t("footer.subscribeText")}</p>
          <NewsletterForm />
          <ul className="flex flex-col gap-2.5 text-[13px] text-fg-muted">
            {contact.map(({ icon: Icon, label, href }) => (
              <li key={href}>
                <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-fg" dir="ltr">
                  <Icon aria-hidden className="shrink-0" /> {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="mb-4 text-[13px] font-semibold text-fg">{column.title}</h2>
            <ul className="flex flex-col gap-3 text-[13px] text-fg-muted">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <Link href={link.href} className={linkClasses}>
                      {link.label}
                    </Link>
                  ) : (
                    <button type="button" onClick={link.onClick} className={linkClasses}>
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-fg-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. {t("footer.rights")} {t("footer.credit")}{" "}
            <a href={SITE.author.url} target="_blank" rel="noreferrer" className="font-medium text-fg hover:text-brand">
              {SITE.author.name}
            </a>
          </p>
          <a href={SITE.author.url} target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-full p-2 text-base transition-colors hover:bg-fg/6 hover:text-fg">
            <LuGithub />
          </a>
        </div>
      </div>
    </footer>
  );
}
