"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import Skeleton from "@/components/shimmer/shimmer";

import { FiMail, FiPhone } from "react-icons/fi";

export default function Contact() {
  const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShimmer(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10 bg-white dark:bg-[#0f0f0f] transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-sm text-[#6b7280] dark:text-[#888]">
          <Link className="transition-all duration-300 hover:text-[#111111] dark:hover:text-white" href="/">Home</Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-[#111111] dark:text-white">Contact</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-4xl border border-[#ececec] dark:border-[#1f1f1f] bg-white dark:bg-[#141414] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-8 transition-colors duration-300">
            <div className="inline-flex rounded-full bg-[#fff5f5] dark:bg-[#2a1010] px-3 py-1 text-sm font-medium text-[var(--brand-red)]">
              Support
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#111111] dark:text-white sm:text-4xl">
              We&apos;re here to help.
            </h1>
            <p className="mt-3 text-base leading-7 text-[#4b5563] dark:text-[#aaa]">
              Reach out for product questions, order updates, or anything else you need. We usually respond within a day.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-[1.25rem] border border-[#f0f0f0] dark:border-[#1f1f1f] bg-[#f9fafb] dark:bg-[#1a1a1a] p-4 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-red)]">
                    <FiPhone className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111] dark:text-white">Call to us</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#888]">Available 24/7, 7 days a week</p>
                  </div>
                </div>
                {shimmer ? (
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-3 w-40 rounded-full" />
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-[#111111] dark:text-[#ccc]">
                    Phone: <span className="font-medium">+123 456 789</span>
                  </p>
                )}
              </div>

              <div className="rounded-[1.25rem] border border-[#f0f0f0] dark:border-[#1f1f1f] bg-[#f9fafb] dark:bg-[#1a1a1a] p-4 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-red)]">
                    <FiMail className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111] dark:text-white">Write to us</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#888]">We reply within 24 hours</p>
                  </div>
                </div>
                {shimmer ? (
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-3 w-48 rounded-full" />
                    <Skeleton className="h-3 w-44 rounded-full" />
                  </div>
                ) : (
                  <div className="mt-4 space-y-1 text-sm text-[#111111] dark:text-[#ccc]">
                    <p>customer@wearzara.com</p>
                    <p>support@wearzara.com</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-[#ececec] dark:border-[#1f1f1f] bg-white dark:bg-[#141414] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-8 transition-colors duration-300">
            <form className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <input type="text" className="w-full rounded-2xl border border-[#e5e7eb] dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] px-4 py-3 text-sm text-[#111111] dark:text-white placeholder:text-[#9ca3af] dark:placeholder:text-[#555] outline-none transition-all duration-300 focus:border-[var(--brand-red)] dark:focus:border-[var(--brand-red)]" placeholder="Your Name" />
                <input type="email" className="w-full rounded-2xl border border-[#e5e7eb] dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] px-4 py-3 text-sm text-[#111111] dark:text-white placeholder:text-[#9ca3af] dark:placeholder:text-[#555] outline-none transition-all duration-300 focus:border-[var(--brand-red)] dark:focus:border-[var(--brand-red)]" placeholder="Your Email" />
                <input type="tel" className="w-full rounded-2xl border border-[#e5e7eb] dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] px-4 py-3 text-sm text-[#111111] dark:text-white placeholder:text-[#9ca3af] dark:placeholder:text-[#555] outline-none transition-all duration-300 focus:border-[var(--brand-red)] dark:focus:border-[var(--brand-red)]" placeholder="Your Phone" />
              </div>
              <textarea className="min-h-45 w-full resize-none rounded-[1.25rem] border border-[#e5e7eb] dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] px-4 py-3 text-sm text-[#111111] dark:text-white placeholder:text-[#9ca3af] dark:placeholder:text-[#555] outline-none transition-all duration-300 focus:border-[var(--brand-red)] dark:focus:border-[var(--brand-red)]" placeholder="Your Message" />
              <div className="flex justify-end">
                <button type="submit" className="rounded-full bg-[var(--brand-red)] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[var(--brand-red-hover)] active:bg-[var(--brand-red-active)] cursor-pointer">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
