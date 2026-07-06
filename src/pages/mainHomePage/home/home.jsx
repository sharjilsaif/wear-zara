"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import Skeleton from "@/components/shimmer/shimmer";

import { FaApple } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { HiArrowRight } from "react-icons/hi2";

export default function HomePage() {
  const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShimmer(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="mb-16 px-4 py-6 sm:px-6 lg:mb-30 lg:px-30 lg:py-0">
      <div className="flex h-auto flex-col gap-6 lg:h-112 lg:flex-row">
        <div className="flex w-full flex-col justify-between gap-3 rounded-lg border border-[#ececec] bg-[#fafafa] p-5 shadow-sm select-none lg:w-[25%] lg:gap-0 lg:rounded-none lg:rounded-b-lg lg:border lg:border-t-transparent lg:border-[#e5e7eb] lg:bg-transparent lg:p-0 lg:pr-4 lg:pl-2 lg:pb-2 lg:pt-8">
          {shimmer ? (
            <div className="flex h-full w-full flex-col justify-between gap-4 md:gap-0">
              <Skeleton className="h-4 w-[90%] rounded-sm bg-[#e4e4e4]" />
              <Skeleton className="h-4 w-[80%] rounded-sm bg-[#e4e4e4]" />
              <Skeleton className="h-4 w-[50%] rounded-sm bg-[#e4e4e4]" />
              <Skeleton className="h-4 w-[30%] rounded-sm bg-[#e4e4e4]" />
              <Skeleton className="h-4 w-[25%] rounded-sm bg-[#e4e4e4]" />
              <Skeleton className="h-4 w-[45%] rounded-sm bg-[#e4e4e4]" />
              <Skeleton className="h-4 w-[40%] rounded-sm bg-[#e4e4e4]" />
            </div>
          ) : (
            <>
              <Link
                href="/shopNow?title=Women's%20Fashion"
                className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-[#f3f4f6] active:scale-97 transition-all duration-300"
              >
                <span>Women's Fashion</span>
                <FaAngleRight />
              </Link>
              <Link
                href="/shopNow?title=Men's%20Fashion"
                className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-[#f3f4f6] active:scale-97 transition-all duration-300"
              >
                <span>Mens's Fashion</span>
                <FaAngleRight />
              </Link>
              <Link
                href="/shopNow?title=Home%20%26%20Lifestyle"
                className="rounded-md px-2 py-2 hover:bg-[#f3f4f6] active:scale-97 transition-all duration-300"
              >
                Home & Lifestyle
              </Link>
              <Link
                href="/shopNow?title=Electronics"
                className="rounded-md px-2 py-2 hover:bg-[#f3f4f6] active:scale-97 transition-all duration-300"
              >
                Electronics
              </Link>
              <Link
                href="/shopNow?title=Medicine"
                className="rounded-md px-2 py-2 hover:bg-[#f3f4f6] active:scale-97 transition-all duration-300"
              >
                Medicine
              </Link>
              <Link
                href="/shopNow?title=Sports%20%26%20Outdoor"
                className="rounded-md px-2 py-2 hover:bg-[#f3f4f6] active:scale-97 transition-all duration-300"
              >
                Sports & Outdoor
              </Link>
              <Link
                href="/shopNow?title=Baby's%20%26%20Toys"
                className="rounded-md px-2 py-2 hover:bg-[#f3f4f6] active:scale-97 transition-all duration-300"
              >
                Baby's & Toys
              </Link>
              <Link
                href="/shopNow?title=Groceries%20%26%20Pets"
                className="rounded-md px-2 py-2 hover:bg-[#f3f4f6] active:scale-97 transition-all duration-300"
              >
                Groceries & Pets
              </Link>
              <Link
                href="/shopNow?title=Health%20%26%20Beauty"
                className="rounded-md px-2 py-2 hover:bg-[#f3f4f6] active:scale-97 transition-all duration-300"
              >
                Health & Beauty
              </Link>
            </>
          )}
        </div>

        <div className="relative flex w-full select-none overflow-hidden rounded-lg bg-black p-6 sm:p-8 lg:ml-6 lg:mt-8 lg:p-10">
          <div className="flex w-full flex-col gap-5 justify-center lg:w-[50%] lg:pl-8 mb-7 md:mb-0">
            {shimmer ? (
              <div className="flex flex-col gap-4 pt-6">
                <Skeleton className="h-10 w-40 rounded-md bg-[#414141]" />
                <Skeleton className="h-10 w-48 rounded-md bg-[#414141]" />
                <Skeleton className="h-10 w-36 rounded-md bg-[#414141]" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 text-white">
                  <div className="rounded-full bg-white/20 p-3">
                    <FaApple className="text-3xl sm:text-4xl" />
                  </div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-gray-300">
                    iPhone 14 Series
                  </p>
                </div>
                <div className="text-white">
                  <p className="text-4xl font-semibold leading-tight sm:text-5xl">
                    Up to 10%
                    <br />
                    off Voucher
                  </p>
                </div>
              </>
            )}
            <Link
              href="/shopNow?title=Mobile%20Phones"
              className="flex w-fit items-center mt-1 gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white transition-all duration-300 hover:gap-3 hover:bg-white/20 active:bg-white/30 active:scale-95"
            >
              <p className="text-sm font-medium">Shop Now</p>
              <HiArrowRight className="text-lg" />
            </Link>
          </div>

          <div className="hidden w-[50%] items-center justify-center overflow-hidden lg:flex">
            {shimmer ? (
              <div className="h-full w-full px-12 py-8">
                <Skeleton className="h-full w-full rounded-xl bg-[#111]" />
              </div>
            ) : (
              <img
                className="w-full object-contain"
                src="iphone.png"
                alt="iPhone"
              />
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center gap-2 cursor-pointer">
            {shimmer ? (
              <Skeleton className="h-3 w-20 rounded-full bg-[#414141]" />
            ) : (
              <>
                <div className="h-2.5 w-2.5 rounded-full bg-gray-400"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-gray-400"></div>
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-gray-400"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-gray-400"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
