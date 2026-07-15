"use client";

import { useState, useEffect, useRef } from "react";

import Skeleton from "@/components/shimmer/shimmer";

import { IoEyeOutline } from "react-icons/io5";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { FaStar, FaRegHeart, FaHeart } from "react-icons/fa6";

export default function FlashSale() {
  const sliderRef = useRef(null);
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [shimmer, setShimmer] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const [redHeart, setRedHeart] = useState([]);
  const [addedCart, setAddedCart] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // 1. Dynamic State for products from the database
  const [sale, setSale] = useState([]);

  // 2. Fetch the "" category products from Neon DB
  useEffect(() => {
    // Modify this if your category slug in Neon is named differently (e.g. 'mens-fashion' or 'men')
    fetch("/api/products?category=flash-sales") 
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load Men's products");
        return res.json();
      })
      .then((data) => {
        setSale(data);
        setShimmer(false);
      })
      .catch((err) => {
        console.error("Error loading Men's products:", err);
        setShimmer(false);
      });
  }, []);

  const startCountdown = () => {
    const randomSeconds = Math.floor(Math.random() * 60);

    const targetDate = new Date(
      Date.now() +
        3 * 24 * 60 * 60 * 1000 +
        19 * 60 * 60 * 1000 +
        randomSeconds * 1000 +
        randomSeconds * 1000,
    );

    const interval = setInterval(() => {
      const now = new Date();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(interval);
        return;
      }

      setDays(
        String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, "0"),
      );
      setHours(
        String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
      );
      setMinutes(
        String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, "0"),
      );
      setSeconds(String(Math.floor((distance / 1000) % 60)).padStart(2, "0"));
    }, 1000);

    return interval;
  };

  useEffect(() => {
    const interval = startCountdown();
    return () => clearInterval(interval);
  }, []);

  // 3. Wishlist integration (Adapted to handle database product structure)
  const handleRedHeart = (product) => {
    const currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    // Using product.id instead of product.title to match DB standards perfectly
    const isAlreadySaved = currentWishlist.some((item) => item.id === product.id);

    let updatedWishlist;

    if (isAlreadySaved) {
      updatedWishlist = currentWishlist.filter((item) => item.id !== product.id);
      setRedHeart((prev) => prev.filter((id) => id !== product.id));
    } else {
      updatedWishlist = [...currentWishlist, product];
      setRedHeart((prev) => [...prev, product.id]);
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  // Sync wishlist and cart states
  useEffect(() => {
    const syncStates = () => {
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setRedHeart(savedWishlist.map((item) => item.id));

      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setAddedCart(savedCart.map((item) => item.id));
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

  // 4. Cart integration (Adapted to handle database product structure)
  const handleCartToggle = (product) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isAlreadyInCart = currentCart.some((item) => item.id === product.id);

    let updatedCart;

    if (isAlreadyInCart) {
      updatedCart = currentCart.filter((item) => item.id !== product.id);
      setAddedCart((prev) => prev.filter((id) => id !== product.id));
    } else {
      const cartProduct = {
        ...product,
        qty: 1,
        price: Number(product.price)
      };
      updatedCart = [...currentCart, cartProduct];
      setAddedCart((prev) => [...prev, product.id]);
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section className="ml-4 border-b border-[#ccc9c9] dark:border-[#525252] pb-15 pl-0 pr-4 sm:ml-6 sm:pr-6 lg:ml-30 lg:pl-20 lg:pr-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-8 rounded-sm bg-[#DB4444]"></div>
          <p className="font-semibold text-sm text-[#DB4444]">Today's</p>
        </div>

        <div className="flex flex-col gap-4 pr-0 sm:flex-row sm:items-center sm:justify-between sm:pr-4 lg:pr-15">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 lg:gap-20">
            <p className="text-2xl font-semibold sm:text-3xl">Flash Sales</p>

            <div className="bg-white dark:bg-black select-none">
              <div className="flex items-end justify-center">
                <div className="flex flex-col items-center w-14">
                  <span className="text-xs font-medium text-gray-900 dark:text-white mb-1 tracking-wide">
                    Days
                  </span>
                  {shimmer ? (
                    <Skeleton className="w-[70%] h-8 mt-1 rounded-sm" />
                  ) : (
                    <span className="text-3xl font-semibold text-black dark:text-white tracking-tight">
                      {days}
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-end h-12 pb-1.5 px-1">
                  <span className="text-xl font-bold text-red-400">:</span>
                </div>

                <div className="flex flex-col items-center w-14">
                  <span className="text-xs font-medium text-gray-900 dark:text-white mb-1 tracking-wide">
                    Hours
                  </span>
                  {shimmer ? (
                    <Skeleton className="w-[70%] h-8 mt-1 rounded-sm" />
                  ) : (
                    <span className="text-3xl font-semibold text-black dark:text-white tracking-tight">
                      {hours}
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-end h-12 pb-1.5 px-1">
                  <span className="text-xl font-bold text-red-400">:</span>
                </div>

                <div className="flex flex-col items-center w-14">
                  <span className="text-xs font-medium text-gray-900 dark:text-white mb-1 tracking-wide">
                    Minutes
                  </span>
                  {shimmer ? (
                    <Skeleton className="w-[70%] h-8 mt-1 rounded-sm" />
                  ) : (
                    <span className="text-3xl font-semibold text-black dark:text-white tracking-tight">
                      {minutes}
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-end h-12 pb-1.5 px-1">
                  <span className="text-xl font-bold text-red-400">:</span>
                </div>

                <div className="flex flex-col items-center w-14">
                  <span className="text-xs font-medium text-gray-900 mb-1 dark:text-white tracking-wide">
                    Seconds
                  </span>
                  {shimmer ? (
                    <Skeleton className="w-[70%] h-8 mt-1 rounded-sm" />
                  ) : (
                    <span className="text-3xl font-semibold text-black dark:text-white tracking-tight">
                      {seconds}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!viewAll && (
            <div className="flex gap-3">
              <span
                onClick={scrollLeft}
                className="cursor-pointer dark:bg-[#2d2d2d] dark:hover:bg-[#444444] dark:active:bg-[#616161] bg-[#f1f0f0] hover:bg-[#e6e5e5] active:bg-[#d1cdcd] transition-all duration-300 w-9 h-9 rounded-full flex items-center justify-center"
              >
                <FiArrowLeft className="text-xl" />
              </span>
              <span
                onClick={scrollRight}
                className="cursor-pointer dark:bg-[#2d2d2d] dark:hover:bg-[#444444] dark:active:bg-[#616161] bg-[#f1f0f0] hover:bg-[#e6e5e5] active:bg-[#d1cdcd] transition-all duration-300 w-9 h-9 rounded-full flex items-center justify-center"
              >
                <FiArrowRight className="text-xl" />
              </span>
            </div>
          )}
        </div>

        {shimmer ? (
          <div className="flex mt-10 mb-16 pb-2 pr-2 gap-9 overflow-x-auto">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-70 min-w-55">
                <Skeleton className="h-[73%] w-full rounded-2xl" />
                <Skeleton className="mt-2 h-[5%] w-[70%] rounded-full" />
                <Skeleton className="mt-3 h-[5%] w-[30%] rounded-full" />
                <Skeleton className="mt-2 h-[5%] w-[50%] rounded-full" />
              </div>
            ))}
          </div>
        ) : sale.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            No products found in Men's category!
          </div>
        ) : (
          <div
            ref={sliderRef}
            className={`mt-10 mb-7 select-none flex ${viewAll ? "flex-wrap justify-start gap-4 sm:gap-6 lg:gap-10" : "gap-4 overflow-x-auto pb-2 pr-2 sm:gap-6 lg:gap-8 xxl:justify-between"}`}
          >
            {sale.map((item, index) => (
              <div
                key={item.id}
                className={`h-80 shrink-0 ${viewAll ? "mb-7 w-full min-w-55 sm:w-[calc(50%-0.75rem)] lg:w-55" : "min-w-55 sm:min-w-57.5 lg:min-w-55"}`}
              >
                <div className="group relative h-56 w-full dark:bg-[#202020] overflow-hidden rounded-2xl border dark:border-[#525252] border-[#f0f0f0] bg-[#f7f7f7] p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center p-0">
                    <img
                      className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                      src={item.imageUrl}
                      alt={item.name}
                      onClick={() => setPreviewImage(item.imageUrl)}
                    />
                  </div>

                  <div className="absolute flex w-full justify-between pt-2 px-2">
                    {item.discountPercentage ? (
                      <span className="flex h-5 w-10 items-center justify-center rounded-full bg-[#DB4444] text-[10px] font-semibold text-white">
                        -{item.discountPercentage}%
                      </span>
                    ) : (
                      <div />
                    )}
                    
                    <div className="flex flex-col gap-2">
                      <div
                        onClick={() => handleRedHeart(item)}
                        className="flex h-8 w-8 cursor-pointer dark:hover:bg-[#b9b9b9] items-center justify-center rounded-full dark:bg-[#b9b9b9] bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#fff5f5] active:bg-[#ebebeb]"
                      >
                        {redHeart.includes(item.id) ? (
                          <FaHeart className="text-md text-[#DB4444]" />
                        ) : (
                          <FaRegHeart className="text-md dark:text-black" />
                        )}
                      </div>
                      <div className="flex h-8 w-8 cursor-pointer items-center dark:hover:bg-[#b9b9b9] justify-center rounded-full dark:bg-[#b9b9b9] bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#f7f7f7] active:bg-[#ebebeb]">
                        <IoEyeOutline className="text-md dark:text-black" />
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleCartToggle(item)}
                    className="absolute bottom-0 w-full bg-[#111111] dark:bg-[#b9b9b9] dark:text-black py-2.5 text-center text-sm text-white opacity-0 translate-y-2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 active:text-[#e3e3e3]"
                  >
                    {addedCart.includes(item.id) ? "Added to Cart" : "Add to Cart"}
                  </div>
                </div>

                <div className="mt-4 flex h-20 flex-col justify-around">
                  <h1 className="text-sm font-semibold text-[#111111] dark:text-white line-clamp-1">
                    {item.name}
                  </h1>
                  <div className="flex gap-2">
                    <p className="text-sm font-semibold text-[#DB4444]">
                      ${item.price}
                    </p>
                    {item.discountPrice && (
                      <p className="text-sm text-[#676666] line-through">
                        ${item.discountPrice}
                      </p>
                    )}
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
                    <p className="text-[#676666] text-xs">({item.reviews})</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="w-full flex justify-center select-none">
          <button
            onClick={() => setViewAll(!viewAll)}
            className="bg-[#DB4444] hover:bg-[#d14444] active:bg-[#bb3d3d] transition-all duration-300 cursor-pointer px-7 py-3 text-sm text-white rounded-md"
          >
            {viewAll ? "View less Products" : "View All Products"}
          </button>
        </div>

        {previewImage && (
          <div onClick={() => setPreviewImage(null)} className="fixed inset-0 cursor-pointer z-50 flex items-center justify-center bg-black/60 p-5">
            <div className="relative h-[40vh] w-[30vw] bg-white dark:bg-[#202020] cursor-default flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img src={previewImage} alt="Preview" className="max-h-[80%] max-w-[80%] object-contain"/>
            </div>
          </div>
        )}
        
      </section>
    </>
  );
}