"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import Skeleton from "@/components/shimmer/shimmer";

import { FiMail, FiPhone } from "react-icons/fi";

export default function Contact() {
  const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShimmer(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-sm text-[#6b7280]">
          <Link
            className="transition-all duration-300 hover:text-[#111111]"
            href="/"
          >
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-[#111111]">Contact</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-4xl border border-[#ececec] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8">
            <div className="inline-flex rounded-full bg-[#fff5f5] px-3 py-1 text-sm font-medium text-[#DB4444]">
              Support
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
              We&apos;re here to help.
            </h1>
            <p className="mt-3 text-base leading-7 text-[#4b5563]">
              Reach out for product questions, order updates, or anything else
              you need. We usually respond within a day.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-[1.25rem] border border-[#f0f0f0] bg-[#f9fafb] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DB4444]">
                    <FiPhone className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111]">Call to us</p>
                    <p className="text-sm text-[#6b7280]">
                      Available 24/7, 7 days a week
                    </p>
                  </div>
                </div>
                {shimmer ? (
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-3 w-40 rounded-full bg-[#e4e4e4]" />
                    <Skeleton className="h-3 w-32 rounded-full bg-[#e4e4e4]" />
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-[#111111]">
                    Phone: <span className="font-medium">+123 456 789</span>
                  </p>
                )}
              </div>

              <div className="rounded-[1.25rem] border border-[#f0f0f0] bg-[#f9fafb] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DB4444]">
                    <FiMail className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111]">Write to us</p>
                    <p className="text-sm text-[#6b7280]">
                      We reply within 24 hours
                    </p>
                  </div>
                </div>
                {shimmer ? (
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-3 w-48 rounded-full bg-[#e4e4e4]" />
                    <Skeleton className="h-3 w-44 rounded-full bg-[#e4e4e4]" />
                  </div>
                ) : (
                  <div className="mt-4 space-y-1 text-sm text-[#111111]">
                    <p>customer@wearzara.com</p>
                    <p>support@wearzara.com</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-[#ececec] bg-linear-to-br from-[#fffdfd] to-[#fff7f7] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8">
            <form className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <input
                  type="text"
                  className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition-all duration-300 focus:border-[#DB4444]"
                  placeholder="Your Name"
                />
                <input
                  type="email"
                  className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition-all duration-300 focus:border-[#DB4444]"
                  placeholder="Your Email"
                />
                <input
                  type="tel"
                  className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition-all duration-300 focus:border-[#DB4444]"
                  placeholder="Your Phone"
                />
              </div>

              <textarea
                className="min-h-45 w-full resize-none rounded-[1.25rem] border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition-all duration-300 focus:border-[#DB4444]"
                placeholder="Your Message"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-full bg-[#DB4444] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#d14444]"
                >
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
