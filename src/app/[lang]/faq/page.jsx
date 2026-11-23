import Link from "next/link";
import { LuPlus } from "react-icons/lu";

import Breadcrumb from "@/components/ui/breadcrumb";
import OpenHashDetails from "@/components/ui/openHashDetails";
import SectionHeader from "@/components/ui/sectionHeader";
import { getI18n, pageMetadata } from "@/i18n/server";
import { FREE_SHIPPING_THRESHOLD, RETURN_DAYS, SHIPPING_FEE } from "@/lib/site";

export const generateMetadata = pageMetadata("faq");

// Ids are anchor targets linked from the product page and service highlights.
const FAQS = ["delivery", "returns", "payment", "coupons", "account", "tracking", "support"];

export default async function FaqPage({ params }) {
  const { t, format } = await getI18n((await params).lang);
  const vars = { amount: format.price(FREE_SHIPPING_THRESHOLD), fee: format.price(SHIPPING_FEE), days: RETURN_DAYS };

  return (
    <div className="container-page max-w-4xl py-10">
      <OpenHashDetails />
      <Breadcrumb items={[{ label: t("nav.faq") }]} />
      <SectionHeader as="h1" eyebrow={t("faq.eyebrow")} title={t("faq.title")} />

      <div className="glass divide-y divide-line rounded-3xl">
        {FAQS.map((id) => (
          <details key={id} id={id} className="group scroll-mt-32 p-5 sm:p-6">
            <summary className="flex list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {t(`faq.items.${id}.q`)}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fg/6 transition-all duration-300 group-open:rotate-45 group-open:bg-brand group-open:text-white">
                <LuPlus aria-hidden />
              </span>
            </summary>
            <p className="mt-3 animate-fade-up text-sm leading-7 text-fg-muted">{t(`faq.items.${id}.a`, vars)}</p>
          </details>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-fg-muted">
        {t("faq.stillNeedHelp")}{" "}
        <Link href="/contact" className="font-semibold text-link hover:underline">
          {t("faq.contactTeam")}
        </Link>
      </p>
    </div>
  );
}
