import Image from "next/image";
import { AiOutlineShop } from "react-icons/ai";
import { FaDollarSign, FaShoppingBag } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";

import ServiceHighlights from "@/components/home/serviceHighlights";
import Breadcrumb from "@/components/ui/breadcrumb";
import SectionHeader from "@/components/ui/sectionHeader";
import { cn } from "@/lib/format";

import ourStory from "../../../public/ourStory.png";
import ethan from "../../../public/malePic-2.png";
import emma from "../../../public/femalePic.png";
import lucas from "../../../public/malePic-1.png";

export const metadata = {
  title: "About Us",
  description: "The story behind Wear Zara — curated fashion for modern shoppers, delivered with care.",
};

const STATS = [
  { icon: AiOutlineShop, value: "10.5K", label: "Brands & sellers on our platform" },
  { icon: FaDollarSign, value: "33K", label: "Monthly product sales" },
  { icon: FaShoppingBag, value: "45.5K", label: "Customers shopping every day" },
  { icon: FaSackDollar, value: "25K", label: "Five-star reviews collected" },
];

const TEAM = [
  { name: "Ethan Carter", role: "Founder & Chairman", image: ethan },
  { name: "Emma Collins", role: "Managing Director", image: emma },
  { name: "Lucas Bennett", role: "Product Designer", image: lucas },
];

export default function AboutPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "About" }]} />

      <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">Our Story</span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">Crafting a smarter, more personal way to shop.</h1>
          <div className="mt-6 space-y-4 leading-7 text-fg-muted">
            <p>
              Wear Zara started with a simple idea: great style shouldn&apos;t be complicated. We bring together
              thoughtfully curated clothing, footwear and accessories for men, women and kids — all in one place.
            </p>
            <p>
              From everyday essentials to statement pieces, every product is picked for quality, comfort and value,
              then delivered quickly with free shipping on orders over $140 and hassle-free 30-day returns.
            </p>
          </div>
        </div>
        <div className="relative aspect-[705/609] overflow-hidden rounded-3xl">
          <Image src={ourStory} alt="Two happy shoppers holding shopping bags" fill priority placeholder="blur" sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
        </div>
      </section>

      <section aria-label="Wear Zara in numbers" className="mt-20 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(({ icon: Icon, value, label }, index) => {
          const highlighted = index === 1;
          return (
            <div
              key={label}
              className={cn(
                "flex flex-col items-center gap-4 rounded-xl border p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                highlighted ? "border-brand bg-brand text-white" : "border-line",
              )}
            >
              <span className={cn("flex h-20 w-20 items-center justify-center rounded-full", highlighted ? "bg-white/30" : "bg-neutral-300 dark:bg-neutral-700")}>
                <span className={cn("flex h-14 w-14 items-center justify-center rounded-full", highlighted ? "bg-white text-black" : "bg-black text-white")}>
                  <Icon aria-hidden className="text-2xl" />
                </span>
              </span>
              <p className="text-3xl font-bold">{value}</p>
              <p className={cn("text-sm", highlighted ? "text-white/90" : "text-fg-muted")}>{label}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-24">
        <SectionHeader eyebrow="Meet the Team" title="The People Behind Wear Zara" />
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((member) => (
            <li key={member.name}>
              <div className="relative flex aspect-4/5 items-end justify-center overflow-hidden rounded-xl bg-surface-muted pt-10">
                <Image src={member.image} alt={member.name} placeholder="blur" sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw" className="h-[90%] w-auto object-contain" />
              </div>
              <h3 className="mt-6 text-2xl font-medium">{member.name}</h3>
              <p className="mt-1 text-fg-muted">{member.role}</p>
            </li>
          ))}
        </ul>
      </section>

      <ServiceHighlights />
    </div>
  );
}
