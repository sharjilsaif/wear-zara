import Link from "next/link";
import { FaGithub } from "react-icons/fa6";

import NewsletterForm from "@/components/layout/newsletterForm";
import { SITE, SHOP_CATEGORIES, shopHref } from "@/lib/site";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Products" },
      ...SHOP_CATEGORIES.slice(0, 4).map((category) => ({ href: shopHref({ category: category.slug }), label: category.name })),
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Login / Register" },
      { href: "/cart", label: "Cart" },
      { href: "/wishlist", label: "Wishlist" },
      { href: "/checkout", label: "Checkout" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/faq", label: "FAQs" },
      { href: "/contact", label: "Contact" },
      { href: "/about", label: "About Us" },
    ],
  },
];

function FooterHeading({ children }) {
  return <h2 className="mb-5 text-lg font-semibold">{children}</h2>;
}

export default function Footer() {
  return (
    <footer className="mt-24 bg-black text-white">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
        <div>
          <p className="mb-5 text-2xl font-bold tracking-tight">{SITE.name}</p>
          <p className="mb-1 font-medium">Subscribe</p>
          <p className="mb-4 text-sm text-neutral-300">Get 10% off your first order</p>
          <NewsletterForm />
        </div>

        <div>
          <FooterHeading>Support</FooterHeading>
          <address className="flex flex-col gap-3 text-sm not-italic text-neutral-300">
            <span>
              {SITE.address[0]}
              <br />
              {SITE.address[1]}
            </span>
            <a href={`mailto:${SITE.email}`} className="hover:text-white">
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phone.replace(/[^\d+]/g, "")}`} className="hover:text-white">
              {SITE.phone}
            </a>
          </address>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <FooterHeading>{column.title}</FooterHeading>
            <ul className="flex flex-col gap-3 text-sm text-neutral-300">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-sm text-neutral-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Designed &amp; developed by{" "}
            <a href={SITE.author.url} target="_blank" rel="noreferrer" className="font-medium text-neutral-200 hover:text-white">
              {SITE.author.name}
            </a>
            .
          </p>
          <a href={SITE.author.url} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-lg hover:text-white">
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
}
