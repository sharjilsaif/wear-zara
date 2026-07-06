"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import Skeleton from "@/components/shimmer/shimmer";

import { IoEyeOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa6";

export default function BestSelling() {
  const [shimmer, setShimmer] = useState(true);
  const [redHeart, setRedHeart] = useState(null);
  const [addedCart, setAddedCart] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShimmer(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleRedHeart = (id) => {
    setRedHeart(redHeart === id ? null : id);
  };

  const handleCard = (index) => {
    setAddedCart(index);
  };

  const bestSelling = [
    {
      imgURL: "coat.png",
      title: "The North Coat",
      priceWas: "360",
      priceNow: "260",
      rating: "88",
    },
    {
      imgURL: "bag.png",
      title: "Gucci Duffle Bag",
      priceWas: "1160",
      priceNow: "960",
      rating: "76",
    },
    {
      imgURL: "mouse.png",
      title: "BRANDED DELL MOUSE",
      priceWas: "100",
      priceNow: "55",
      rating: "40",
    },
    {
      imgURL: "cpuCooler.png",
      title: "RGB Liquid CPU Cooler",
      priceWas: "170",
      priceNow: "160",
      rating: "26",
    },
    {
      imgURL: "bookSelf.png",
      title: "Small BookSelf",
      priceWas: "400",
      priceNow: "360",
      rating: "99",
    },
  ];

  return (
    <>
      <section className="mx-4 pt-12 sm:mx-6 lg:mx-30 lg:pt-17">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-8 rounded-sm bg-[#DB4444]"></div>
          <p className="font-semibold text-sm text-[#DB4444]">This Month</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xl font-semibold sm:text-3xl">
            Best Selling Products
          </p>

          <div className="">
            <Link
              href="/shopNow?title=Best%20Selling"
              className="bg-[#DB4444] hover:bg-[#d14444] active:bg-[#bb3d3d] transition-all duration-300 cursor-pointer px-9 py-3 text-sm text-white rounded-md"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-20 md:gap-4 py-10 select-none sm:justify-between">
          {shimmer ? (
            <>
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-70 w-55">
                  <Skeleton className="h-[75%] w-full rounded-2xl bg-[#e4e4e4]" />
                  <Skeleton className="mt-2 h-[6%] w-[70%] rounded-full bg-[#e4e4e4]" />
                  <Skeleton className="mt-3 h-[6%] w-[30%] rounded-full bg-[#e4e4e4]" />
                  <Skeleton className="mt-2 h-[6%] w-[50%] rounded-full bg-[#e4e4e4]" />
                </div>
              ))}
            </>
          ) : (
            <>
              {bestSelling.map((item, index) => (
                <div
                  key={index}
                  className="h-70 w-full min-w-55 sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] xl:min-w-55 xl:w-55"
                >
                  <div className="group relative h-56 w-full overflow-hidden rounded-2xl border border-[#f0f0f0] bg-[#f7f7f7] p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <img
                        className="h-auto max-h-[75%] w-auto max-w-[80%] object-contain transition-all duration-300 group-hover:scale-105"
                        src={item.imgURL}
                        alt=""
                      />
                    </div>

                    <div className="absolute right-2 top-2 flex flex-col gap-2">
                      <div
                        onClick={() => handleRedHeart(index)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#fff5f5] active:bg-[#ebebeb]"
                      >
                        {redHeart === index ? (
                          <FaHeart className="text-md text-[#DB4444]" />
                        ) : (
                          <FaRegHeart className="text-md" />
                        )}
                      </div>
                      <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#f7f7f7] active:bg-[#ebebeb]">
                        <IoEyeOutline className="text-md" />
                      </div>
                    </div>

                    <div
                      onClick={() => handleCard(index)}
                      className="absolute bottom-0 w-full bg-[#111111] py-2.5 text-center text-sm text-white opacity-0 translate-y-2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 active:text-[#e3e3e3]"
                    >
                      {addedCart === index ? "Added to Card" : "Add to Cart"}
                    </div>
                  </div>

                  <div className="mt-4 flex h-20 flex-col justify-around">
                    <h1 className="text-sm font-semibold text-[#111111]">
                      {item.title}
                    </h1>
                    <div className="flex gap-2">
                      <p className="text-sm font-semibold text-[#DB4444]">
                        ${item.priceNow}
                      </p>
                      <p className="text-sm text-[#676666] line-through">
                        ${item.priceWas}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className="text-xs text-yellow-500"
                          />
                        ))}
                      </div>
                      <p className="text-[#676666] text-xs">({item.rating})</p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}
