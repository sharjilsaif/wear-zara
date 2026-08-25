"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import Skeleton from "@/components/shimmer/shimmer";
import { readStorageList, toggleStoredItem } from "@/lib/localStorageHelpers";

import { IoEyeOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa6";

export default function BestSelling() {
  const [shimmer, setShimmer] = useState(true);
  const [redHeart, setRedHeart] = useState([]);
  const [addedCart, setAddedCart] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [bestSelling, setBestSelling] = useState([]);

  useEffect(() => {
    fetch("/api/products?category=best-selling")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load Best Selling products");
        return res.json();
      })
      .then((data) => {
        setBestSelling(data);
        setShimmer(false);
      })
      .catch((err) => {
        console.error("Error loading Best Selling products:", err);
        setShimmer(false);
      });
  }, []);

  useEffect(() => {
    const syncStates = () => {
      const savedWishlist = readStorageList("wishlist");
      setRedHeart(savedWishlist.map((item) => item.id));

      const savedCart = readStorageList("cart");
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

  const handleRedHeart = (product) => {
    const updatedWishlist = toggleStoredItem("wishlist", product);
    setRedHeart(updatedWishlist.map((item) => item.id));
  };

  const handleCartToggle = (product) => {
    const updatedCart = toggleStoredItem("cart", {
      ...product,
      qty: 1,
      price: Number(product.price),
    });
    setAddedCart(updatedCart.map((item) => item.id));
  };

  return (
    <>
      <section className="mx-4 pt-12 sm:mx-6 lg:mx-30 lg:pt-17">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-8 rounded-sm bg-(--brand-red)"></div>
          <p className="font-semibold text-sm text-(--brand-red)">
            This Month
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xl font-semibold sm:text-3xl">
            Best Selling Products
          </p>

          <div className="hidden md:block">
            <Link
              href="/shopNow?title=Best%20Selling"
              className="bg-(--brand-red) hover:bg-(--brand-red-hover) active:bg-(--brand-red-active) transition-all duration-300 cursor-pointer px-9 py-3 text-sm text-white rounded-md"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-4 pt-15 pb-12 select-none sm:justify-between sm:gap-6 lg:gap-8">
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
          ) : bestSelling.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              No products found in Best Selling category.
            </div>
          ) : (
            <>
              {bestSelling.map((item) => (
                <div
                  key={item.id}
                  className="h-70 w-full mb-7  min-w-55 sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] xl:min-w-55 xl:w-55"
                >
                  <div className="group relative h-56 w-full overflow-hidden rounded-2xl border border-[#f0f0f0] dark:border-[#525252] bg-[#f7f7f7] dark:bg-[#202020] p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                    <div className="absolute inset-0 flex items-center justify-center p-0">
                      <img
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                        src={item.imageUrl}
                        alt={item.name}
                        onClick={() => setPreviewImage(item.imageUrl)}
                      />
                    </div>

                    <div className="absolute right-2 top-2 flex flex-col gap-2">
                      <div
                        onClick={() => handleRedHeart(item)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-[#b9b9b9] shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#fff5f5] dark:hover:bg-[#b9b9b9] active:bg-[#ebebeb]"
                      >
                        {redHeart.includes(item.id) ? (
                          <FaHeart className="text-md text-var(--brand-red)" />
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
                      {addedCart.includes(item.id)
                        ? "Added to Cart"
                        : "Add to Cart"}
                    </div>
                  </div>

                  <div className="mt-4 flex h-20 flex-col justify-around">
                    <h1 className="text-sm font-semibold text-[#111111] dark:text-white line-clamp-1">
                      {item.name}
                    </h1>
                    <div className="flex gap-2">
                      <p className="text-sm font-semibold text-(--brand-red)">
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
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-xs text-yellow-500" />
                        ))}
                      </div>
                      <p className="text-[#676666] text-xs">({item.reviews})</p>
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
            className="bg-(--brand-red) hover:bg-(--brand-red-hover) active:bg-(--brand-red-active) transition-all duration-300 cursor-pointer px-9 py-3 text-sm text-white rounded-md"
          >
            View All
          </Link>
        </div>

        {previewImage && (
          <div
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 cursor-pointer z-50 flex items-center justify-center bg-black/60 p-5"
          >
            <div
              className="relative h-[40vh] w-[30vw] bg-white dark:bg-[#202020] cursor-default flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewImage}
                alt="Preview"
                className="max-h-[80%] max-w-[80%] object-contain"
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}
