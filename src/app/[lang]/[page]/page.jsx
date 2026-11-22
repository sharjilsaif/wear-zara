import Link from "next/link";
import { LuArrowUpRight, LuBriefcase, LuMapPin } from "react-icons/lu";

import Breadcrumb from "@/components/ui/breadcrumb";
import SectionHeader from "@/components/ui/sectionHeader";
import { getI18n } from "@/i18n/server";
import { FREE_SHIPPING_THRESHOLD, RETURN_DAYS, SHIPPING_FEE, SITE } from "@/lib/site";

// URL slug -> dictionary key under `pages.*`. Any other slug is a 404.
const PAGES = {
  shipping: "shipping",
  returns: "returns",
  "size-guide": "sizeGuide",
  careers: "careers",
  privacy: "privacy",
  terms: "terms",
  cookies: "cookies",
};
const LEGAL = ["privacy", "terms", "cookies"];

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PAGES).map((page) => ({ page }));
}

export async function generateMetadata({ params }) {
  const { lang, page } = await params;
  const { t } = await getI18n(lang);
  return { title: t(`pages.${PAGES[page]}.title`), description: t(`pages.${PAGES[page]}.description`) };
}

const SIZES = {
  women: [
    ["XS", "80–84", "62–66", "88–92"],
    ["S", "84–88", "66–70", "92–96"],
    ["M", "88–92", "70–74", "96–100"],
    ["L", "92–98", "74–80", "100–106"],
    ["XL", "98–104", "80–86", "106–112"],
  ],
  men: [
    ["S", "88–94", "74–80", "90–96"],
    ["M", "94–100", "80–86", "96–102"],
    ["L", "100–106", "86–92", "102–108"],
    ["XL", "106–112", "92–98", "108–114"],
    ["XXL", "112–118", "98–104", "114–120"],
  ],
};

function SizeTables({ t }) {
  const head = ["size", "chest", "waist", "hips"].map((key) => t(`pages.sizeGuide.table.${key}`));
  return Object.entries(SIZES).map(([group, rows]) => (
    <section key={group} className="glass overflow-hidden rounded-3xl">
      <h2 className="px-6 pt-6 text-lg font-semibold">{t(`pages.sizeGuide.table.${group}`)}</h2>
      <div className="overflow-x-auto p-6 pt-4">
        <table className="w-full min-w-[28rem] text-sm" dir="ltr">
          <thead>
            <tr className="border-b border-line text-start text-xs text-fg-muted">
              {head.map((cell) => (
                <th key={cell} className="py-3 text-start font-medium">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map(([size, ...cells]) => (
              <tr key={size}>
                <td className="py-3 font-semibold">{size}</td>
                {cells.map((cell, index) => (
                  <td key={index} className="py-3 tabular-nums text-fg-muted">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  ));
}

function OpenRoles({ t, dict }) {
  return (
    <section className="glass rounded-3xl p-6">
      <h2 className="mb-4 text-lg font-semibold">{t("pages.careers.openRoles")}</h2>
      <ul className="divide-y divide-line">
        {dict.pages.careers.roles.map((role, index) => (
          <li key={index}>
            <a
              href={`mailto:careers@wearzara.com?subject=${encodeURIComponent(role.title)}`}
              className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-brand"
            >
              <div>
                <p className="font-medium">{role.title}</p>
                <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-fg-muted">
                  <span className="inline-flex items-center gap-1">
                    <LuBriefcase aria-hidden /> {role.team}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <LuMapPin aria-hidden /> {role.location}
                  </span>
                </p>
              </div>
              <LuArrowUpRight aria-hidden className="shrink-0 text-fg-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand rtl:-scale-x-100" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function InfoPage({ params }) {
  const { lang, page } = await params;
  const { t, dict, format } = await getI18n(lang);
  const key = PAGES[page];
  const content = dict.pages[key];
  const vars = { amount: format.price(FREE_SHIPPING_THRESHOLD), fee: format.price(SHIPPING_FEE), days: RETURN_DAYS, email: SITE.email, phone: SITE.phone };

  return (
    <div className="container-page max-w-4xl py-10">
      <Breadcrumb items={[{ label: t(`pages.${key}.title`) }]} />
      <SectionHeader as="h1" eyebrow={t(LEGAL.includes(page) ? "footer.legal" : "footer.help")} title={content.title} />
      <p className="-mt-4 mb-10 text-[17px] leading-8 text-fg-muted">{t(`pages.${key}.intro`, vars)}</p>

      <div className="flex flex-col gap-6">
        {page === "size-guide" && <SizeTables t={t} />}
        {page === "careers" && <OpenRoles t={t} dict={dict} />}

        <div className="glass divide-y divide-line rounded-3xl">
          {content.sections.map((section, index) => (
            <section key={index} className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-2 text-[15px] leading-7 text-fg-muted">{t(`pages.${key}.sections.${index}.body`, vars)}</p>
            </section>
          ))}
        </div>

        {LEGAL.includes(page) && <p className="text-xs text-fg-muted">{t("pages.lastUpdated", { date: format.date("2026-11-22") })}</p>}

        <p className="text-center text-sm text-fg-muted">
          {t("faq.stillNeedHelp")}{" "}
          <Link href="/contact" className="font-semibold text-link hover:underline">
            {t("faq.contactTeam")}
          </Link>
        </p>
      </div>
    </div>
  );
}
