import { FiMail, FiPhone } from "react-icons/fi";

import ContactForm from "@/components/contact/contactForm";
import Breadcrumb from "@/components/ui/breadcrumb";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Contact Us",
  description: "Questions about an order or a product? Get in touch with the Wear Zara support team.",
};

const CHANNELS = [
  {
    icon: FiPhone,
    title: "Call Us",
    text: "We are available 24/7, 7 days a week.",
    lines: [{ label: SITE.phone, href: `tel:${SITE.phone.replace(/[^\d+]/g, "")}` }],
  },
  {
    icon: FiMail,
    title: "Write to Us",
    text: "Fill out our form and we will contact you within 24 hours.",
    lines: [{ label: SITE.email, href: `mailto:${SITE.email}` }],
  },
];

export default function ContactPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Contact" }]} />
      <h1 className="sr-only">Contact us</h1>

      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <div className="divide-y divide-line rounded-xl border border-line p-8 shadow-sm">
          {CHANNELS.map(({ icon: Icon, title, text, lines }) => (
            <section key={title} className="py-8 first:pt-0 last:pb-0">
              <div className="mb-6 flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
                  <Icon aria-hidden />
                </span>
                <h2 className="font-medium">{title}</h2>
              </div>
              <p className="text-sm">{text}</p>
              {lines.map((line) => (
                <a key={line.href} href={line.href} className="mt-3 block text-sm hover:text-brand">
                  {line.label}
                </a>
              ))}
            </section>
          ))}
        </div>

        <div className="rounded-xl border border-line p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
