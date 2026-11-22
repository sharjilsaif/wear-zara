"use client";

import Link from "next/link";
import { LuCheck } from "react-icons/lu";

import ArtImage from "@/components/ui/artImage";
import { useI18n } from "@/i18n/client";

const PHOTO = "1558769132-cb1aea458c5e";
const SOURCES = [
  { media: "(min-width: 1024px)", id: PHOTO, w: 900, h: 1100, crop: "entropy" },
  { id: PHOTO, w: 900, h: 420, crop: "entropy" },
];
const PERKS = ["sync", "track", "offers"];

/** Editorial photo + glass panel on one side, the form on the other (stacked on phones). */
export default function AuthLayout({ title, subtitle, children }) {
  const { t } = useI18n();

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="glass grid overflow-hidden rounded-[2rem] lg:min-h-[44rem] lg:grid-cols-[1.05fr_1fr]">
        <div className="relative h-52 sm:h-64 lg:h-auto">
          <ArtImage sources={SOURCES} alt="" priority />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute inset-x-4 bottom-4 lg:inset-x-8 lg:bottom-8">
            <div className="rounded-3xl bg-white/12 p-5 text-white ring-1 ring-white/20 backdrop-blur-xl lg:p-7">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                Wear<span className="text-sky-300">Zara</span>
              </Link>
              <p className="mt-2 text-xl font-semibold leading-snug tracking-tight lg:text-2xl">{t("auth.panelTitle")}</p>
              <ul className="mt-4 hidden flex-col gap-2.5 text-sm text-white/85 lg:flex">
                {PERKS.map((perk) => (
                  <li key={perk} className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                      <LuCheck aria-hidden className="text-xs" />
                    </span>
                    {t(`auth.perks.${perk}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-12 lg:py-14">
          <div className="w-full max-w-sm animate-fade-up">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mb-8 mt-2 text-[15px] text-fg-muted">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
