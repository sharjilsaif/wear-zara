import Link from "next/link";
import { FiPlus } from "react-icons/fi";

import Breadcrumb from "@/components/ui/breadcrumb";
import SectionHeader from "@/components/ui/sectionHeader";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, SITE } from "@/lib/site";

export const metadata = {
  title: "FAQs",
  description: "Answers to common questions about orders, delivery, returns and payments at Wear Zara.",
};

const FAQS = [
  {
    q: "How much does delivery cost?",
    a: `Delivery is free on every order over $${FREE_SHIPPING_THRESHOLD}. Below that, a flat $${SHIPPING_FEE} fee applies. Most orders arrive within 2–4 business days.`,
  },
  {
    q: "What is your return policy?",
    a: "You can return any unworn item within 30 days of delivery for a full refund. Refunds are processed within one week of us receiving the item.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We currently offer cash on delivery. Card payments are coming soon.",
  },
  {
    q: "Do you have any discount codes?",
    a: "Yes! New customers can use WELCOME10 at checkout for 10% off their first order. Subscribe to our newsletter to hear about future offers.",
  },
  {
    q: "Do I need an account to place an order?",
    a: "No — you can check out as a guest. Creating an account makes checkout faster because your details are pre-filled.",
  },
  {
    q: "How can I contact customer support?",
    a: `Our team is available 24/7 at ${SITE.email} or ${SITE.phone}. You can also use the contact form.`,
  },
];

export default function FaqPage() {
  return (
    <div className="container-page max-w-4xl py-10">
      <Breadcrumb items={[{ label: "FAQs" }]} />
      <SectionHeader as="h1" eyebrow="Help Center" title="Frequently Asked Questions" />

      <div className="divide-y divide-line rounded-xl border border-line">
        {FAQS.map((item) => (
          <details key={item.q} className="group p-5 sm:p-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {item.q}
              <FiPlus aria-hidden className="shrink-0 text-lg transition-transform duration-200 group-open:rotate-45" />
            </summary>
            <p className="mt-3 text-sm leading-6 text-fg-muted">{item.a}</p>
          </details>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-fg-muted">
        Still need help?{" "}
        <Link href="/contact" className="font-semibold text-brand hover:underline">
          Contact our team
        </Link>
      </p>
    </div>
  );
}
