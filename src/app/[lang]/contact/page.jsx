import { LuMail, LuMapPin, LuPhone } from "react-icons/lu";

import ContactForm from "@/components/contact/contactForm";
import Breadcrumb from "@/components/ui/breadcrumb";
import SectionHeader from "@/components/ui/sectionHeader";
import { getI18n, pageMetadata } from "@/i18n/server";
import { SITE } from "@/lib/site";

export const generateMetadata = pageMetadata("contact");

export default async function ContactPage({ params }) {
  const { t } = await getI18n((await params).lang);

  const channels = [
    { icon: LuPhone, title: t("contact.call"), text: t("contact.callText"), label: SITE.phone, href: `tel:${SITE.phone.replace(/[^\d+]/g, "")}` },
    { icon: LuMail, title: t("contact.write"), text: t("contact.writeText"), label: SITE.email, href: `mailto:${SITE.email}` },
    { icon: LuMapPin, title: t("contact.visit"), text: t("contact.visitText"), label: SITE.address.join(", "), href: `https://maps.google.com/?q=${encodeURIComponent(SITE.address.join(", "))}` },
  ];

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: t("nav.contact") }]} />
      <SectionHeader as="h1" eyebrow={t("contact.eyebrow")} title={t("contact.title")} />

      <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <ul className="flex flex-col gap-4">
          {channels.map(({ icon: Icon, title, text, label, href }) => (
            <li key={title}>
              <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="glass group flex gap-4 rounded-3xl p-6 transition-all duration-300 ease-apple hover:-translate-y-0.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand text-lg text-white">
                  <Icon aria-hidden />
                </span>
                <div className="min-w-0">
                  <h2 className="font-semibold">{title}</h2>
                  <p className="mt-1 text-sm text-fg-muted">{text}</p>
                  <p className="mt-2 text-sm font-medium text-link group-hover:underline" dir="ltr">
                    {label}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <div className="glass rounded-3xl p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
