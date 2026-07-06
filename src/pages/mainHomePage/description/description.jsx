"use client";

import { useState, useEffect } from "react";

import Skeleton from "@/components/shimmer/shimmer";

import { TbTruckDelivery } from "react-icons/tb";
import { RiCustomerServiceLine } from "react-icons/ri";
import { MdOutlineVerifiedUser } from "react-icons/md";

export default function Description() {
  const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShimmer(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto my-10 flex flex-col gap-20 md:flex-row md:flex-wrap md:justify-center lg:my-30 lg:gap-20">
          <div className="flex flex-col items-center gap-4">
            {shimmer ? (
              <>
                <Skeleton className="w-11 h-11 rounded-full bg-[#e4e4e4]" />
              </>
            ) : (
              <>
                <div className="w-13 h-13 rounded-full bg-[#b9b8b8] flex items-center justify-center cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                    <TbTruckDelivery className="text-white text-3xl" />
                  </div>
                </div>
              </>
            )}
            {shimmer ? (
              <>
                <div className="flex flex-col gap-2 items-center">
                  <Skeleton className="w-50 h-5 bg-[#e4e4e4] rounded-lg" />
                  <Skeleton className="w-30 h-3 bg-[#e4e4e4] rounded-lg" />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <p className="font-bold">FREE AND FAST DELIVERY</p>
                  <p className="text-xs text-center">
                    Free delivery for all orders over $140
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col items-center gap-4">
            {shimmer ? (
              <>
                <Skeleton className="w-11 h-11 rounded-full bg-[#e4e4e4]" />
              </>
            ) : (
              <>
                <div className="w-13 h-13 rounded-full bg-[#b9b8b8] flex items-center justify-center cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                    <RiCustomerServiceLine className="text-white text-3xl" />
                  </div>
                </div>
              </>
            )}
            {shimmer ? (
              <>
                <div className="flex flex-col gap-2 items-center">
                  <Skeleton className="w-50 h-5 bg-[#e4e4e4] rounded-lg" />
                  <Skeleton className="w-30 h-3 bg-[#e4e4e4] rounded-lg" />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <p className="font-bold">24/7 CUSTOMER SUPPORT</p>
                  <p className="text-xs text-center">
                    Friendly 24/7 Customer Service
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col items-center gap-4">
            {shimmer ? (
              <>
                <Skeleton className="w-11 h-11 rounded-full bg-[#e4e4e4]" />
              </>
            ) : (
              <>
                <div className="w-13 h-13 rounded-full bg-[#b9b8b8] flex items-center justify-center cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                    <MdOutlineVerifiedUser className="text-white text-3xl" />
                  </div>
                </div>
              </>
            )}
            {shimmer ? (
              <>
                <div className="flex flex-col gap-2 items-center">
                  <Skeleton className="w-50 h-5 bg-[#e4e4e4] rounded-lg" />
                  <Skeleton className="w-30 h-3 bg-[#e4e4e4] rounded-lg" />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <p className="font-bold">MONEY BACK GUARANTEE</p>
                  <p className="text-xs text-center">
                    We return money within one week
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
