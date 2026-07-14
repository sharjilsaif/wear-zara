"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import Skeleton from "@/components/shimmer/shimmer";

import { IoEyeOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa6";

export default function BestSelling() {
  const [shimmer, setShimmer] = useState(true);
  const [redHeart, setRedHeart] = useState([]);
  const [addedCart, setAddedCart] = useState([]);
  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShimmer(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleRedHeart = (product) => {
    const currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isAlreadySaved = currentWishlist.some((item) => item.title === product.title);

    let updatedWishlist;

    if (isAlreadySaved) {
      updatedWishlist = currentWishlist.filter((item) => item.title !== product.title);
      setRedHeart((prev) => prev.filter((title) => title !== product.title));
    } else {
      updatedWishlist = [...currentWishlist, product];
      setRedHeart((prev) => [...prev, product.title]);
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    window.dispatchEvent(new Event("wishlist-updated"));
  };

  useEffect(() => {
      const syncStates = () => {
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setRedHeart(savedWishlist.map((item) => item.title));
  
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setAddedCart(savedCart.map((item) => item.title));
      };
  
      syncStates();
  
      window.addEventListener("wishlist-updated", syncStates);
      window.addEventListener("cart-updated", syncStates);
      window.addEventListener("storage", syncStates);
  
      return () => {
        window.removeEventListener("wishlist-updated", syncStates);
        window.removeEventListener("cart-updated", syncStates);
        window.removeEventListener("storage", syncStates);
      };
    }, []);

  const handleCartToggle = (product) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isAlreadyInCart = currentCart.some((item) => item.title === product.title);

    let updatedCart;

    if (isAlreadyInCart) {
      updatedCart = currentCart.filter((item) => item.title !== product.title);
      setAddedCart((prev) => prev.filter((title) => title !== product.title));
    } else {
      const cartProduct = {
        ...product,
        id: product.id || Date.now() + Math.random(),
        qty: 1,
        price: Number(product.priceNow)
      };
      updatedCart = [...currentCart, cartProduct];
      setAddedCart((prev) => [...prev, product.title]);
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
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

          <div className="hidden md:block">
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
                  <Skeleton className="h-[75%] w-full rounded-2xl" />
                  <Skeleton className="mt-2 h-[6%] w-[70%] rounded-full" />
                  <Skeleton className="mt-3 h-[6%] w-[30%] rounded-full" />
                  <Skeleton className="mt-2 h-[6%] w-[50%] rounded-full" />
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
                  <div className="group relative h-56 w-full overflow-hidden rounded-2xl border border-[#f0f0f0] dark:border-[#525252] bg-[#f7f7f7] dark:bg-[#202020] p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <img
                        className="h-auto max-h-[75%] w-auto max-w-[80%] object-contain transition-all duration-300 group-hover:scale-105"
                        src={item.imgURL}
                        alt={item.title}
                        onClick={() => {setPreviewImage(item.imgURL)}}
                      />
                    </div>

                    <div className="absolute right-2 top-2 flex flex-col gap-2">
                      <div
                        onClick={() => handleRedHeart(item)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-[#b9b9b9] shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#fff5f5] dark:hover:bg-[#b9b9b9] active:bg-[#ebebeb]"
                      >
                        {redHeart.includes(item.title) ? (
                          <FaHeart className="text-md text-[#DB4444]" />
                        ) : (
                          <FaRegHeart className="text-md dark:text-black" />
                        )}
                      </div>
                      <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-[#b9b9b9] shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#f7f7f7] dark:hover:bg-[#b9b9b9] active:bg-[#ebebeb]">
                        <IoEyeOutline className="text-md dark:text-black" />
                      </div>
                    </div>

                    <div
                      onClick={() => handleCartToggle(item)}
                      className="absolute bottom-0 w-full bg-[#111111] dark:bg-[#b9b9b9] dark:text-black py-2.5 text-center text-sm text-white opacity-0 translate-y-2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 active:text-[#e3e3e3]"
                    >
                      {addedCart.includes(item.title) ? "Added to Card" : "Add to Cart"}
                    </div>
                  </div>

                  <div className="mt-4 flex h-20 flex-col justify-around">
                    <h1 className="text-sm font-semibold text-[#111111] dark:text-white">
                      {item.title}
                    </h1>
                    <div className="flex gap-2">
                      <p className="text-sm font-semibold text-[#DB4444]">
                        ${item.priceNow}
                      </p>
                      <p className="text-sm text-[#676666] dark:text-[#676666] line-through">
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

        <div className="mt-7 flex justify-center md:hidden">
            <Link
              href="/shopNow?title=Best%20Selling"
              className="bg-[#DB4444] hover:bg-[#d14444] active:bg-[#bb3d3d] transition-all duration-300 cursor-pointer px-9 py-3 text-sm text-white rounded-md"
            >
              View All
            </Link>
          </div>

        {previewImage && (<div onClick={() => setPreviewImage(null)} className="fixed inset-0 cursor-pointer z-50 flex items-center justify-center bg-black/60 p-5">

          <div className="relative h-[40vh] w-[30vw] bg-white dark:bg-[#202020] cursor-default flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="Preview" className="max-h-[80%] max-w-[80%] object-contain"/>
          </div>

        </div>)}    
          
      </section>
    </>
  );
}
