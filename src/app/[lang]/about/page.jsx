import Image from "next/image";

import ServiceHighlights from "@/components/home/serviceHighlights";
import Breadcrumb from "@/components/ui/breadcrumb";
import Button from "@/components/ui/button";
import { getI18n, pageMetadata } from "@/i18n/server";

import ourStory from "../../../../public/ourStory.png";

export const generateMetadata = pageMetadata("about");

export default async function AboutPage({ params }) {
  const { t } = await getI18n((await params).lang);

  return (
    <>
      <div className="container-page pt-10">
        <Breadcrumb items={[{ label: t("nav.about") }]} />

        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">{t("about.eyebrow")}</span>
            <h1 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">{t("about.title")}</h1>
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
      </div>
      <ServiceHighlights />
    </>
  );
}
