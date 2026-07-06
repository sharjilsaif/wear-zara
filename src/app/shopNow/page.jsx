"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Skeleton from "@/components/shimmer/shimmer";

import { IoEyeOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa6";

function ShopNowContent() {
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

  const [shimmer, setShimmer] = useState(true);
  const [redHeart, setRedHeart] = useState(null);
  const [addedCart, setAddedCart] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [displayProducts, setDisplayProducts] = useState([]);

  const searchParams = useSearchParams();
  const title = searchParams.get("title") ?? "Products";

  useEffect(() => {
    const randomProducts = [...ourProducts].sort(() => Math.random() - 0.5);
    setDisplayProducts(randomProducts);
  }, []);

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

  const handleViewMore = () => {
    setLoadingMore(true);

    setTimeout(() => {
      const randomProducts = [...ourProducts].sort(() => Math.random() - 0.5);

      setDisplayProducts((prev) => [...prev, ...randomProducts]);
      setLoadingMore(false);
    }, 3000);
  };

  return (
    <section className="mt-15 mx-30 mb-25">
      <div className="text-[#807f7f] mb-15">
        <Link className="hover:text-black transition-all duration-300" href="/">
          Home
        </Link>
        <span> / </span>
        <span className="text-[#111]">{title}</span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-8 rounded-sm bg-[#DB4444]"></div>
        <p className="font-semibold text-sm text-[#DB4444]">{title}</p>
      </div>

      <p className="font-semibold text-3xl text-start">
        Explore Latest Products
      </p>

      <div className="flex flex-wrap justify-between gap-8 pt-15 pb-12 select-none">
        {shimmer ? (
          [...Array(10)].map((_, index) => (
            <div key={index} className="h-70 w-55">
              <Skeleton className="h-[75%] w-full rounded-2xl bg-[#e4e4e4]" />
              <Skeleton className="mt-2 h-[6%] w-[70%] rounded-full bg-[#e4e4e4]" />
              <Skeleton className="mt-3 h-[6%] w-[30%] rounded-full bg-[#e4e4e4]" />
              <Skeleton className="mt-2 h-[6%] w-[50%] rounded-full bg-[#e4e4e4]" />
            </div>
          ))
        ) : (
          <>
            {displayProducts.map((item, index) => (
              <div key={index} className="h-70 w-55 mb-10">
                <div className="group relative h-56 w-full cursor-pointer overflow-hidden rounded-2xl border border-[#f0f0f0] bg-[#f7f7f7] p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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
                    <p className="text-[#676666] text-xs">({item.rating})</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        {loadingMore &&
          [...Array(10)].map((_, index) => (
            <div key={`loading-${index}`} className="h-70 w-55">
              <Skeleton className="h-[75%] w-full rounded-2xl bg-[#e4e4e4]" />
              <Skeleton className="mt-2 h-[6%] w-[70%] rounded-full bg-[#e4e4e4]" />
              <Skeleton className="mt-3 h-[6%] w-[30%] rounded-full bg-[#e4e4e4]" />
              <Skeleton className="mt-2 h-[6%] w-[50%] rounded-full bg-[#e4e4e4]" />
            </div>
          ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleViewMore}
          className="bg-[#DB4444] hover:bg-[#d14444] active:bg-[#bb3d3d] transition-all duration-300 cursor-pointer px-7 py-3 text-sm text-white rounded-md"
        >
          View More Products
        </button>
      </div>
    </section>
  );
}

export default function ShopNow() {
  return (
    <Suspense
      fallback={
        <div className="mx-30 my-20 text-center text-sm text-[#676666]">
          Loading products...
        </div>
      }
    >
      <ShopNowContent />
    </Suspense>
  );
}
