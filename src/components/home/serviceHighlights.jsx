import { MdOutlineVerifiedUser } from "react-icons/md";
import { RiCustomerServiceLine } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";

import { FREE_SHIPPING_THRESHOLD } from "@/lib/site";

const SERVICES = [
  { icon: TbTruckDelivery, title: "Free and Fast Delivery", text: `Free delivery for all orders over $${FREE_SHIPPING_THRESHOLD}` },
  { icon: RiCustomerServiceLine, title: "24/7 Customer Service", text: "Friendly 24/7 customer support" },
  { icon: MdOutlineVerifiedUser, title: "Money Back Guarantee", text: "We return money within 30 days" },
];

/** Delivery / support / guarantee strip shown on the home and about pages. */
export default function ServiceHighlights() {
  return (
    <section className="container-page py-16 lg:py-24">
      <ul className="grid gap-12 sm:grid-cols-3 sm:gap-8">
        {SERVICES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex flex-col items-center gap-5 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-300 dark:bg-neutral-700">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
                <Icon aria-hidden className="text-3xl" />
              </span>
            </span>
            <div>
              <h3 className="font-semibold uppercase">{title}</h3>
              <p className="mt-1 text-sm text-fg-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
