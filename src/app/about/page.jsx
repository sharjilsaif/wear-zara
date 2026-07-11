"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import Skeleton from "@/components/shimmer/shimmer";
import Description from "@/pages/mainHomePage/description/description";

import { AiOutlineShop } from "react-icons/ai";
import { FaSackDollar, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { FaShoppingBag, FaInstagram, FaDollarSign } from "react-icons/fa";

export default function About() {
  const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShimmer(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const aboutItems = [
    { icon: AiOutlineShop, rating: "10.5K", data: "Sellers active on our site" },
    { icon: FaDollarSign, rating: "33K", data: "Monthly product sales" },
    { icon: FaShoppingBag, rating: "45.5K", data: "Customers shopping daily" },
    { icon: FaSackDollar, rating: "25K", data: "Annual gross revenue" },
  ];

  const teamMembers = [
    { name: "Ethan Carter", role: "Founder & Chairman", image: "malePic-2.png" },
    { name: "Emma Collins", role: "Managing Director", image: "femalePic.png" },
    { name: "Lucas Bennett", role: "Product Designer", image: "malePic-1.png" },
  ];

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10 bg-white dark:bg-[#0f0f0f] transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-sm text-[#6b7280] dark:text-[#888]">
          <Link className="transition-all duration-300 hover:text-[#111111] dark:hover:text-white" href="/">Home</Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-[#111111] dark:text-white">About</span>
        </div>

        <div className="grid items-center gap-8 rounded-4xl border border-[#ececec] dark:border-[#1f1f1f] bg-white dark:bg-[#141414] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] lg:grid-cols-[1.05fr_0.95fr] lg:p-10 transition-colors duration-300">
          <div className="space-y-5">
            <div className="inline-flex rounded-full bg-[#fff5f5] dark:bg-[#2a1010] px-3 py-1 text-sm font-medium text-[#DB4444]">
              Our story
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#111111] dark:text-white sm:text-4xl">
              Crafting a smarter, more personal shopping experience.
            </h1>
            {shimmer ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-[92%] rounded-full" />
                <Skeleton className="h-4 w-[88%] rounded-full" />
                <Skeleton className="h-4 w-[80%] rounded-full" />
              </div>
            ) : (
              <div className="space-y-4 text-base leading-7 text-[#4b5563] dark:text-[#aaa]">
                <p>Launched in 2015, Exclusive is South Asia&apos;s premier online shopping marketplace with an active presence in Bangladesh. We support brands and sellers with tailored marketing, data, and service solutions that scale with ambition.</p>
                <p>Today, we offer more than a million products across categories that range from everyday essentials to statement pieces, all delivered with speed and care.</p>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-[#f0f0f0] dark:border-[#1f1f1f] bg-[#f7f7f7] dark:bg-[#1a1a1a] p-3 shadow-sm">
            {shimmer ? (
              <Skeleton className="h-80 w-full rounded-[1.4rem]" />
            ) : (
              <img className="h-80 w-full rounded-[1.4rem] object-cover" src="ourStory.png" alt="Our story" />
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {aboutItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === 1;
            return (
              <div key={index} className={`flex min-h-45 cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.3rem] border p-5 text-center transition-all duration-300 ${isActive ? "border-[#DB4444] bg-[#DB4444] text-white shadow-lg shadow-[#db44441f] hover:bg-[#d14444]" : "border-[#ececec] dark:border-[#1f1f1f] bg-white dark:bg-[#141414] hover:-translate-y-1 hover:bg-[#fafafa] dark:hover:bg-[#1a1a1a]"}`}>
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${isActive ? "bg-white/20" : "bg-[#f3f4f6] dark:bg-[#252525]"}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isActive ? "bg-white" : "bg-[#111111] dark:bg-white"}`}>
                    <Icon className={`text-xl ${isActive ? "text-[#111111]" : "text-white dark:text-[#111]"}`} />
                  </div>
                </div>
                <p className={`text-2xl font-semibold ${isActive ? "text-white" : "text-[#111] dark:text-white"}`}>{item.rating}</p>
                <p className={`text-sm ${isActive ? "text-white/90" : "text-[#6b7280] dark:text-[#888]"}`}>{item.data}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#DB4444]">Meet the team</p>
              <h2 className="text-2xl font-semibold text-[#111111] dark:text-white sm:text-3xl">People behind every great experience</h2>
            </div>
            <p className="text-sm text-[#6b7280] dark:text-[#888]">A passionate team building thoughtful products for modern shoppers.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {shimmer
              ? [0, 1, 2].map((item) => (
                  <div key={item} className="rounded-3xl border border-[#ececec] dark:border-[#1f1f1f] bg-white dark:bg-[#141414] p-4 shadow-sm">
                    <Skeleton className="h-72 w-full rounded-[1.2rem]" />
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-4 w-28 rounded-full" />
                      <Skeleton className="h-4 w-36 rounded-full" />
                    </div>
                  </div>
                ))
              : teamMembers.map((member, index) => (
                  <div key={index} className="group overflow-hidden rounded-3xl border border-[#ececec] dark:border-[#1f1f1f] bg-white dark:bg-[#141414] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                    <div className="bg-[#f7f7f7] dark:bg-[#1a1a1a] p-4">
                      <img className="h-72 w-full rounded-[1.2rem] object-contain transition-all duration-300 group-hover:scale-[1.02]" src={member.image} alt={member.name} />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{member.name}</h3>
                      <p className="mt-1 text-sm text-[#6b7280] dark:text-[#888]">{member.role}</p>
                      <div className="mt-4 flex gap-3 text-[#6b7280] dark:text-[#666]">
                        <FaXTwitter className="cursor-pointer transition-all duration-300 hover:text-[#DB4444]" />
                        <FaInstagram className="cursor-pointer transition-all duration-300 hover:text-[#DB4444]" />
                        <FaLinkedinIn className="cursor-pointer transition-all duration-300 hover:text-[#DB4444]" />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        <div className="mt-12">
          <Description />
        </div>
      </div>
    </section>
  );
}
