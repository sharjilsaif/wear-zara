"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import Skeleton from "@/components/shimmer/shimmer";

import { IoEyeOutline } from "react-icons/io5";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa6";

export default function ExploreProducts() {
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

  const ourProducts = [
    {
      imgURL: "dogFood.png",
      title: "Breed Dry Dog Food",
      priceNow: "100",
      rating: "35",
    },
    {
      imgURL: "dslrCamera.png",
      title: "CANON EOS DSLR Camera",
      priceNow: "360",
      rating: "95",
    },
    {
      imgURL: "asusLaptop.png",
      title: "ASUS FSD Gaming Laptop",
      priceNow: "700",
      rating: "325",
    },
    {
      imgURL: "curologyProduct.png",
      title: "Curology Product Set",
      priceNow: "500",
      rating: "145",
    },
    {
      imgURL: "coat.png",
      title: "The North Coat",
      priceNow: "260",
      rating: "88",
    },
    {
      imgURL: "kidsElectricCar.png",
      title: "Kids Electric Car",
      priceNow: "960",
      rating: "65",
    },
    {
      imgURL: "soccerCleats.png",
      title: "Jr. Zoom Soccer Cleats",
      priceNow: "660",
      rating: "55",
    },
    {
      imgURL: "usbGamepad.png",
      title: "Shooter USB Gamepad",
      priceNow: "480",
      rating: "94",
    },
    {
      imgURL: "satinJacket.png",
      title: "Quited Satin Jacket",
      priceNow: "1200",
      rating: "98",
    },
    {
      imgURL: "coat.png",
      title: "The North Coat",
      priceNow: "260",
      rating: "88",
    },
  ];

  return (
    <>
      <section className="mx-4 sm:mx-6 lg:mx-30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-8 rounded-sm bg-[#DB4444]"></div>
          <p className="font-semibold text-sm text-[#DB4444]">Our Products</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xl font-semibold sm:text-3xl">
            Explore Our Products
          </p>

          <div className="flex gap-3">
            <span className="cursor-pointer bg-[#f1f0f0] hover:bg-[#e6e5e5] active:bg-[#d1cdcd] transition-all duration-300 w-9 h-9 rounded-full flex items-center justify-center">
              <FiArrowLeft className="text-xl" />
            </span>
            <span className="cursor-pointer bg-[#f1f0f0] hover:bg-[#e6e5e5] active:bg-[#d1cdcd] transition-all duration-300 w-9 h-9 rounded-full flex items-center justify-center">
              <FiArrowRight className="text-xl" />
            </span>
          </div>
        </div>

        <div className="">
          {shimmer ? (
            <>
              <div className="flex flex-wrap justify-center gap-6 pt-15 pb-12 sm:justify-between">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="h-70 w-55">
                    <Skeleton className="h-[75%] w-full rounded-2xl bg-[#e4e4e4]" />
                    <Skeleton className="mt-2 h-[6%] w-[70%] rounded-full bg-[#e4e4e4]" />
                    <Skeleton className="mt-3 h-[6%] w-[30%] rounded-full bg-[#e4e4e4]" />
                    <Skeleton className="mt-2 h-[6%] w-[50%] rounded-full bg-[#e4e4e4]" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-20 md:gap-4 pt-15 pb-12 select-none sm:justify-between sm:gap-6 lg:gap-8">
                {ourProducts.map((item, index) => (
                  <div
                    key={index}
                    className="mb-7 h-70 w-full min-w-55 sm:w-[calc(50%-0.75rem)] lg:w-55"
                  >
                    <div className="group relative h-56 w-full cursor-pointer overflow-hidden rounded-2xl border border-[#f0f0f0] bg-[#f7f7f7] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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
                      <p className="text-sm font-semibold text-[#DB4444]">
                        ${item.priceNow}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, index) => (
                            <FaStar
                              key={index}
                              className="text-xs text-yellow-500"
                            />
                          ))}
                        </div>
                        <p className="text-[#676666] text-xs">
                          ({item.rating})
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center">
          <Link
            href="/shopNow?title=Our%20Products"
            className="bg-[#DB4444] hover:bg-[#d14444] active:bg-[#bb3d3d] transition-all duration-300 cursor-pointer px-7 py-3 text-sm text-white rounded-md"
          >
            View All Products
          </Link>
        </div>
      </section>
    </>
  );
}
