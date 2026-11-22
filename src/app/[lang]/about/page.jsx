import Image from "next/image";
import { LuShoppingBag, LuStar, LuStore, LuUsers } from "react-icons/lu";

import ServiceHighlights from "@/components/home/serviceHighlights";
import Breadcrumb from "@/components/ui/breadcrumb";
import Button from "@/components/ui/button";
import SectionHeader from "@/components/ui/sectionHeader";
import { getI18n, pageMetadata } from "@/i18n/server";

import ProductImage from "@/components/product/productImage";

import ourStory from "../../../../public/ourStory.png";

export const generateMetadata = pageMetadata("about");

const STATS = [
  { icon: LuStore, value: "10.5K", key: "brands" },
  { icon: LuShoppingBag, value: "33K", key: "sales" },
  { icon: LuUsers, value: "45.5K", key: "customers" },
  { icon: LuStar, value: "25K", key: "reviews" },
];

const TEAM = [
  { name: "Daniel Hayes", key: "founder", photo: "1560250097-0b93528c311a" },
  { name: "Sofia Marquez", key: "creative", photo: "1573496359142-b8d87734a5a2" },
  { name: "Amara Okafor", key: "design", photo: "1531123897727-8f129e1688ce" },
  { name: "Ryan Mitchell", key: "experience", photo: "1507003211169-0a1dd7228f2d" },
];

export default async function AboutPage({ params }) {
  const { t } = await getI18n((await params).lang);

  return (
    <>
      <div className="container-page pt-10">
        <Breadcrumb items={[{ label: t("nav.about") }]} />

        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">{t("about.eyebrow")}</span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">{t("about.title")}</h1>
            <div className="mt-6 space-y-4 text-[17px] leading-8 text-fg-muted">
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/shop" size="lg">
                {t("common.shopNow")}
              </Button>
              <Button href="/contact" size="lg" variant="secondary">
                {t("nav.contact")}
              </Button>
            </div>
          </div>
          <div className="relative aspect-[705/609] overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgb(0_0_0/0.12)]">
            <Image
              src={ourStory}
              alt={t("about.imageAlt")}
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        <section aria-label={t("about.statsLabel")} className="mt-20 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {STATS.map(({ icon: Icon, value, key }) => (
            <div key={key} className="glass flex flex-col items-center gap-3 rounded-3xl p-6 text-center sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-xl text-brand">
                <Icon aria-hidden />
              </span>
              <p className="text-3xl font-semibold tracking-tight" dir="ltr">
                {value}
              </p>
              <p className="text-sm text-fg-muted">{t(`about.stats.${key}`)}</p>
            </div>
          ))}
        </section>

        <section className="mt-24">
          <SectionHeader eyebrow={t("about.teamEyebrow")} title={t("about.teamTitle")} />
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {TEAM.map((member) => (
              <li key={member.name} className="glass group overflow-hidden rounded-3xl">
                <div className="relative aspect-4/5 overflow-hidden bg-surface">
                  <ProductImage
                    src={`https://images.unsplash.com/photo-${member.photo}`}
                    alt={member.name}
                    fill
                    sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 90vw"
                    className="object-cover object-top transition-transform duration-700 ease-apple group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm font-medium text-brand">{t(`about.team.${member.key}.role`)}</p>
                  <p className="mt-3 text-sm leading-6 text-fg-muted">{t(`about.team.${member.key}.bio`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <ServiceHighlights />
    </>
  );
}
