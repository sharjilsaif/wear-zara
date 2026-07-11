"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import Skeleton from "@/components/shimmer/shimmer";

export default function ProductDetails() {
  const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShimmer(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="mx-4 my-12 sm:mx-6 lg:mx-30 lg:my-20 ">
        <div className="flex min-h-105 w-full flex-col overflow-hidden rounded-lg bg-black dark:bg-[#202020] lg:h-110 lg:flex-row">
          <div className="flex w-full flex-col justify-center px-6 py-8 sm:px-10 lg:w-[50%] lg:px-15">
            <h1 className="text-[#eb4848]">Categories</h1>
            {shimmer ? (
              <>
                <Skeleton className="w-[55%] h-11 mt-5 mb-3 rounded-xl" />
                <Skeleton className="w-[70%] h-11 mb-8 rounded-xl" />
              </>
            ) : (
              <>
                <h1 className="text-white text-2xl md:text-5xl font-semibold mb-8 mt-5 tracking-wide">
                  Enhance Your
                  <br />
                  Music Experience
                </h1>
              </>
            )}

            <div className="mb-8 flex flex-wrap gap-3 sm:gap-7 justify-between w-full md:justify-start">
              {shimmer ? (
                <>
                  <Skeleton className="w-13 h-13 rounded-full" />
                  <Skeleton className="w-13 h-13 rounded-full" />
                  <Skeleton className="w-13 h-13 rounded-full" />
                  <Skeleton className="w-13 h-13 rounded-full" />
                </>
              ) : (
                <>
                  <div className="bg-white dark:text-black cursor-pointer w-14 md:w-18 h-11 rounded-full flex flex-col items-center justify-center gap-1 leading-none">
                    <span className="font-bold text-sm leading-none">23</span>
                    <span className="text-xs leading-none">Hours</span>
                  </div>
                  <div className="bg-white dark:text-black cursor-pointer w-14 md:w-18 h-11 rounded-full flex flex-col items-center justify-center gap-1 leading-none">
                    <span className="font-bold text-sm leading-none">05</span>
                    <span className="text-xs leading-none">Days</span>
                  </div>
                  <div className="bg-white dark:text-black cursor-pointer w-14 md:w-18 h-11 rounded-full flex flex-col items-center justify-center gap-1 leading-none">
                    <span className="font-bold text-sm leading-none">59</span>
                    <span className="text-xs leading-none">Minutes</span>
                  </div>
                  <div className="bg-white dark:text-black cursor-pointer w-14 md:w-18 h-11 rounded-full flex flex-col items-center justify-center gap-1 leading-none">
                    <span className="font-bold text-sm leading-none">35</span>
                    <span className="text-xs leading-none">Seconds</span>
                  </div>
                </>
              )}
            </div>

            {shimmer ? (
              <Skeleton className="w-[25%] h-12 rounded-md" />
            ) : (
              <>
                <Link
                  href="/shopNow?title=Speakers%20Electronics"
                  className="bg-[#DB4444] hover:bg-[#d14444] active:bg-[#bb3d3d] transition-all duration-300 cursor-pointer px-10 w-fit py-3 text-sm text-white rounded-md"
                >
                  Buy Now!
                </Link>
              </>
            )}
          </div>

          <div className="group relative flex w-full items-center justify-center px-6 py-8 sm:px-10 lg:w-[50%] lg:px-0 lg:py-0">
            <div className="absolute bg-[#878585] transition-all duration-300 w-[80%] h-[90%] group-hover:w-[90%] group-hover:h-[95%] blur-3xl group-hover:blur-1xl opacity-50 rounded-full" />
            {shimmer ? (
              <Skeleton className="w-[80%] h-[70%] rounded-full" />
            ) : (
              <>
                <img
                  className="relative max-w-[320px] cursor-pointer object-contain sm:max-w-105"
                  src="product.png"
                  alt=""
                />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
