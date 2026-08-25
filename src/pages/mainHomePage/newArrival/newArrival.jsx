"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import Skeleton from "@/components/shimmer/shimmer";

import { HiArrowRight } from "react-icons/hi2";

export default function NewArrival() {
  const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShimmer(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="mx-4 mt-16 sm:mx-6 sm:mt-20 lg:mx-10 lg:mt-28 xl:mx-30 xl:mt-35">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-8 rounded-sm bg-[var(--brand-red)]"></div>
          <p className="font-semibold text-sm text-[var(--brand-red)]">Featured</p>
        </div>

        <p className="font-semibold text-2xl sm:text-3xl">New Arrival</p>

        <div className="mt-8 flex gap-5 flex-col md:flex-row">
          <div className="group relative min-h-72 sm:min-h-80 bg-black dark:bg-[#202020] md:w-1/2 overflow-hidden">
            {shimmer ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <img
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] sm:w-[70%] md:w-auto max-h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                src="playstation.png"
                alt="PlayStation 5"
              />
            )}
            <div className="pointer-events-none absolute  inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute text-white bottom-0 p-5 sm:p-7">
              {shimmer ? (
                <>
                  <Skeleton className="w-30 h-7 mb-5 rounded-sm" />
                  <Skeleton className="w-55 h-4 mb-6 rounded-xl" />
                </>
              ) : (
                <>
                  <h1 className="font-semibold text-lg sm:text-xl">PlayStation 5</h1>
                  <p className="text-sm my-3">
                    Black and White version of the PS5
                    <br />
                    coming out on sale.
                  </p>
                </>
              )}
              <Link
                href="/shopNow?title=PlayStations"
                className="flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white transition-all duration-300 hover:gap-3 hover:bg-white/20 active:bg-white/30 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-red)]"
              >
                <p className="text-white text-md transition-all duration-300 hover:text-gray-200 select-none">
                  Shop Now
                </p>
                <HiArrowRight className="text-lg" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-5 md:w-1/2">
            <div className="flex min-h-64 sm:min-h-65 w-full flex-col group bg-black dark:bg-[#202020] sm:flex-row md:h-1/2">
              <div className="group relative h-full w-full text-white sm:w-1/2 overflow-hidden">
                <div className="absolute bottom-0 p-5">
                  {shimmer ? (
                    <>
                      <Skeleton className="w-30 h-7 mb-5 rounded-sm" />
                      <Skeleton className="w-55 h-4 mb-6 rounded-xl" />
                    </>
                  ) : (
                    <>
                      <h1 className="font-semibold text-lg sm:text-xl">
                        Women's Collections
                      </h1>
                      <p className="text-sm my-3">
                        Featured Woman collections that
                        <br />
                        give you another vibe.
                      </p>
                    </>
                  )}
                  <Link
                    href="/shopNow?title=Women's%20Fashion"
                    className="flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white transition-all duration-300 hover:gap-3 hover:bg-white/20 active:bg-white/30 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-red)]"
                  >
                    <p className="text-white text-md transition-all duration-300 hover:text-gray-200 select-none">
                      Shop Now
                    </p>
                    <HiArrowRight className="text-lg" />
                  </Link>
                </div>
              </div>

              <div className=" relative h-48 w-full overflow-hidden sm:h-full sm:w-1/2">
                {shimmer ? (
                  <Skeleton className="w-full h-full rounded-t-full" />
                ) : (
                  <img
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] sm:w-[70%] md:w-auto max-h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    src="women.png"
                    alt="Women's fashion collection"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 md:h-1/2">
              <div className="group relative flex min-h-56 sm:min-h-65 items-center justify-center bg-black dark:bg-[#202020] overflow-hidden">
                {shimmer ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <img
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] sm:w-[70%] md:w-auto max-h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    src="speakers.png"
                    alt="Amazon wireless speakers"
                  />
                )}
                <div className="text-white absolute left-0 bottom-0 p-4 sm:p-5 z-10">
                  {shimmer ? (
                    <>
                      <Skeleton className="w-24 sm:w-30 h-6 sm:h-7 mb-5 rounded-sm" />
                      <Skeleton className="w-32 sm:w-55 h-4 mb-2 rounded-xl" />
                    </>
                  ) : (
                    <>
                      <h1 className="font-semibold text-base sm:text-xl">Speakers</h1>
                      <p className="text-xs sm:text-sm my-1">Amazon Wireless Speakers</p>
                    </>
                  )}
                  <Link
                    href="/shopNow?title=Speakers"
                    className="flex w-fit items-center mt-3 gap-2 rounded-full border border-white/25 bg-white/10 px-3 sm:px-4 py-2 text-white transition-all duration-300 hover:gap-3 hover:bg-white/20 active:bg-white/30 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-red)]"
                  >
                    <p className="text-white text-sm sm:text-md transition-all duration-300 hover:text-gray-200 select-none">
                      Shop Now
                    </p>
                    <HiArrowRight className="text-lg" />
                  </Link>
                </div>
              </div>

              <div className="group relative h-full min-h-56 sm:min-h-65 bg-black dark:bg-[#202020] flex items-center justify-center overflow-hidden">
                {shimmer ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <img
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] sm:w-[70%] md:w-auto max-h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    src="perfumes.png"
                    alt="Gucci Intense Oud eau de parfum"
                  />
                )}
                <div className="text-white absolute left-0 bottom-0 p-4 sm:p-5 z-10">
                  {shimmer ? (
                    <>
                      <Skeleton className="w-24 sm:w-30 h-6 sm:h-7 mb-5 rounded-sm" />
                      <Skeleton className="w-32 sm:w-55 h-4 mb-2 rounded-xl" />
                    </>
                  ) : (
                    <>
                      <h1 className="font-semibold text-base sm:text-xl">Perfume</h1>
                      <p className="text-xs sm:text-sm my-1">GUCCI INTENSE OUD EDP</p>
                    </>
                  )}
                  <Link
                    href="/shopNow?title=Perfumes"
                    className="flex w-fit items-center mt-3 gap-2 rounded-full border border-white/25 bg-white/10 px-3 sm:px-4 py-2 text-white transition-all duration-300 hover:gap-3 hover:bg-white/20 active:bg-white/30 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-red)]"
                  >
                    <p className="text-white text-sm sm:text-md transition-all duration-300 hover:text-gray-200 select-none">
                      Shop Now
                    </p>
                    <HiArrowRight className="text-lg" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}