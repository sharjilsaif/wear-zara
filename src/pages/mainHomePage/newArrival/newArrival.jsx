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
      <section className="mx-4 mt-20 sm:mx-6 lg:mx-30 lg:mt-35">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-8 rounded-sm bg-[#DB4444]"></div>
          <p className="font-semibold text-sm text-[#DB4444]">Featured</p>
        </div>

        <p className="font-semibold text-3xl">New Arrival</p>

        {/* <div className="mt-8 flex flex-col gap-5 lg:mt-12 lg:h-135 lg:flex-row">
          <div className="relative min-h-80 bg-black lg:w-[50%]">
            {shimmer ? (
              <>
                <Skeleton className="w-full h-full bg-[#111]" />
              </>
            ) : (
              <>
                <img
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                  src="playstation.png"
                  alt=""
                />
              </>
            )}
            <div className="absolute text-white bottom-0 p-7">
              {shimmer ? (
                <>
                  <Skeleton className="w-30 h-7 mb-5 bg-[#414141] rounded-sm" />
                  <Skeleton className="w-55 h-4 mb-6 bg-[#414141] rounded-xl" />
                </>
              ) : (
                <>
                  <h1 className="font-semibold text-xl">PlayStation 5</h1>
                  <p className="text-sm my-3">
                    Black and White version of the PS5
                    <br />
                    coming out on sale.
                  </p>
                </>
              )}
              <Link
                href="/shopNow?title=PlayStations"
                className="flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white transition-all duration-300 hover:gap-3 hover:bg-white/20 active:bg-white/30 active:scale-95"
              >
                <p className=" text-white text-md transition-all duration-300 hover:text-gray-200 select-none">
                  Shop Now
                </p>
                <HiArrowRight className="text-lg" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:w-[50%]">
            <div className="flex min-h-[260px] w-full flex-col bg-black group sm:flex-row lg:h-[50%]">
              <div className="relative h-full w-full text-white sm:w-[50%]">
                <div className="absolute bottom-0 p-5">
                  {shimmer ? (
                    <>
                      <Skeleton className="w-30 h-7 mb-5 bg-[#414141] rounded-sm" />
                      <Skeleton className="w-55 h-4 mb-6 bg-[#414141] rounded-xl" />
                    </>
                  ) : (
                    <>
                      <h1 className="font-semibold text-xl">
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
                    className="flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white transition-all duration-300 hover:gap-3 hover:bg-white/20 active:bg-white/30 active:scale-95"
                  >
                    <p className=" text-white text-md transition-all duration-300 hover:text-gray-200  select-none">
                      Shop Now
                    </p>
                    <HiArrowRight className="text-lg" />
                  </Link>
                </div>
              </div>

              <div className="relative h-48 w-full sm:h-full sm:w-[50%]">
                {shimmer ? (
                  <>
                    <Skeleton className="w-full h-full rounded-t-full bg-[#111]" />
                  </>
                ) : (
                  <>
                    <img
                      className="absolute bottom-0 right-7 group-hover:right-20 transition-all duration-700 w-full h-full object-cover"
                      src="women.png"
                      alt=""
                    />
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row lg:h-[50%]">
              <div className="relative flex min-h-[260px] items-center justify-center bg-[#1d1d1d] sm:w-[50%]">
                {shimmer ? (
                  <>
                    <Skeleton className="w-full h-full bg-[#111]" />
                  </>
                ) : (
                  <>
                    <img className="absolute z-10" src="speakers.png" alt="" />
                  </>
                )}
                <div className="text-white absolute left-0 bottom-0 p-5 z-10">
                  {shimmer ? (
                    <>
                      <Skeleton className="w-30 h-7 mb-5 bg-[#414141] rounded-sm" />
                      <Skeleton className="w-55 h-4 mb-2 bg-[#414141] rounded-xl" />
                    </>
                  ) : (
                    <>
                      <h1 className="font-semibold text-xl">Speakers</h1>
                      <p className="text-sm my-1">Amazon Wireless Speakers</p>
                    </>
                  )}
                  <Link
                    href="/shopNow?title=Speakers"
                    className="flex w-fit items-center mt-3 gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white transition-all duration-300 hover:gap-3 hover:bg-white/20 active:bg-white/30 active:scale-95"
                  >
                    <p className=" text-white text-md transition-all duration-300 hover:text-gray-200  select-none">
                      Shop Now
                    </p>
                    <HiArrowRight className="text-lg" />
                  </Link>
                </div>
              </div>

              <div className="w-[50%] h-full bg-[#1d1d1d] relative flex items-center justify-center">
                {shimmer ? (
                  <>
                    <Skeleton className="w-full h-full bg-[#111]" />
                  </>
                ) : (
                  <>
                    <img className="absolute z-10" src="perfumes.png" alt="" />
                  </>
                )}
                <div className="text-white absolute left-0 bottom-0 p-5 z-10">
                  {shimmer ? (
                    <>
                      <Skeleton className="w-30 h-7 mb-5 bg-[#414141] rounded-sm" />
                      <Skeleton className="w-55 h-4 mb-2 bg-[#414141] rounded-xl" />
                    </>
                  ) : (
                    <>
                      <h1 className="font-semibold text-xl">Perfume</h1>
                      <p className="text-sm my-1">GUCCI INTENSE OUD EDP</p>
                    </>
                  )}
                  <Link
                    href="/shopNow?title=Perfumes"
                    className="flex w-fit items-center mt-3 gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white transition-all duration-300 hover:gap-3 hover:bg-white/20 active:bg-white/30 active:scale-95"
                  >
                    <p className=" text-white text-md transition-all duration-300 hover:text-gray-200  select-none">
                      Shop Now
                    </p>
                    <HiArrowRight className="text-lg" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </section>
    </>
  );
}
