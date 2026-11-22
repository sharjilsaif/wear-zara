"use client";

import Link from "next/link";
import { LuHeadphones, LuShieldCheck, LuTruck } from "react-icons/lu";

import { useI18n } from "@/i18n/client";
import { FREE_SHIPPING_THRESHOLD, RETURN_DAYS } from "@/lib/site";

const SERVICES = [
  { key: "delivery", icon: LuTruck, href: "/faq#delivery" },
  { key: "support", icon: LuHeadphones, href: "/contact" },
  { key: "guarantee", icon: LuShieldCheck, href: "/faq#returns" },
];

/** Delivery / support / guarantee strip — each card links to the details. */
export default function ServiceHighlights() {
  const { t, format } = useI18n();
  const vars = { amount: format.price(FREE_SHIPPING_THRESHOLD), days: RETURN_DAYS };

  return (
    <section className="container-page py-16 lg:py-20">
      <ul className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {SERVICES.map(({ key, icon: Icon, href }) => (
          <li key={key}>
            <Link href={href} className="glass group flex h-full flex-col items-center gap-4 rounded-3xl p-8 text-center transition-all duration-300 ease-apple hover:-translate-y-1">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-2xl text-brand transition-transform duration-300 group-hover:scale-110">
                <Icon aria-hidden />
              </span>
              <h3 className="text-[17px] font-semibold">{t(`services.${key}.title`)}</h3>
              <p className="text-sm text-fg-muted">{t(`services.${key}.text`, vars)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
