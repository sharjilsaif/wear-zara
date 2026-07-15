"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import Skeleton from "@/components/shimmer/shimmer";

import { IoEyeOutline } from "react-icons/io5";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa6";

export default function ExploreProducts() {
  const [shimmer, setShimmer] = useState(true);
  const [redHeart, setRedHeart] = useState([]);
  const [addedCart, setAddedCart] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [ourProducts, setOurProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products?category=explore-products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load Explore products");
        return res.json();
      })
      .then((data) => {
        setOurProducts(data);
        setShimmer(false);
      })
      .catch((err) => {
        console.error("Error loading Explore products:", err);
        setShimmer(false);
      });
  }, []);

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

  const handleRedHeart = (product) => {
    const currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
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

  const handleCartToggle = (product) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isAlreadyInCart = currentCart.some((item) => item.id === product.id);

    let updatedCart;

    if (isAlreadyInCart) {
      updatedCart = currentCart.filter((item) => item.id !== product.id);
      setAddedCart((prev) => prev.filter((id) => id !== product.id));
    } else {
      const cartProduct = { ...product, qty: 1, price: Number(product.price) };
      updatedCart = [...currentCart, cartProduct];
      setAddedCart((prev) => [...prev, product.id]);
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  return (
    <>
      <section className="mx-4 sm:mx-6 lg:mx-30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-8 rounded-sm bg-[#DB4444]"></div>
          <p className="font-semibold text-sm text-[#DB4444]">Our Products</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xl font-semibold sm:text-3xl">Explore Our Products</p>

          <div className="flex gap-3">
            <span className="cursor-pointer dark:bg-[#2d2d2d] dark:hover:bg-[#444444] dark:active:bg-[#616161] bg-[#f1f0f0] hover:bg-[#e6e5e5] active:bg-[#d1cdcd] transition-all duration-300 w-9 h-9 rounded-full flex items-center justify-center">
              <FiArrowLeft className="text-xl" />
            </span>
            <span className="cursor-pointer dark:bg-[#2d2d2d] dark:hover:bg-[#444444] dark:active:bg-[#616161] bg-[#f1f0f0] hover:bg-[#e6e5e5] active:bg-[#d1cdcd] transition-all duration-300 w-9 h-9 rounded-full flex items-center justify-center">
              <FiArrowRight className="text-xl" />
            </span>
          </div>
        </div>

        <div>
          {shimmer ? (
            <div className="flex flex-wrap justify-center gap-6 pt-15 pb-12 sm:justify-between">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="h-70 w-55">
                  <Skeleton className="h-[75%] w-full rounded-2xl" />
                  <Skeleton className="mt-2 h-[6%] w-[70%] rounded-full" />
                  <Skeleton className="mt-3 h-[6%] w-[30%] rounded-full" />
                  <Skeleton className="mt-2 h-[6%] w-[50%] rounded-full" />
                </div>
              ))}
            </div>
          ) : ourProducts.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              No products found in Explore category.
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-20 md:gap-4 pt-15 pb-12 select-none sm:justify-between sm:gap-6 lg:gap-8">
              {ourProducts.map((item) => (
                <div
                  key={item.id}
                  className="mb-7 h-70 w-full min-w-55 sm:w-[calc(50%-0.75rem)] lg:w-55"
                >
                  <div className="group relative h-56 w-full cursor-pointer overflow-hidden rounded-2xl border border-[#f0f0f0] dark:border-[#525252] bg-[#f7f7f7] dark:bg-[#202020] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="absolute inset-0 flex items-center justify-center p-0">
                      <img
                        className="max-h-full max-w-full object-contain transition-all duration-300 group-hover:scale-105"
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
                      {addedCart.includes(item.id) ? "Added to Cart" : "Add to Cart"}
                    </div>
                  </div>

                  <div className="mt-4 flex h-20 flex-col justify-around">
                    <h1 className="text-sm font-semibold text-[#111111] dark:text-white line-clamp-1">
                      {item.name}
                    </h1>
                    <div className="flex gap-2">
                      <p className="text-sm font-semibold text-[#DB4444]">${item.price}</p>
                      {item.discountPrice && (
                        <p className="text-sm text-[#676666] line-through">${item.discountPrice}</p>
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
            </div>
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

        {previewImage && (
          <div onClick={() => setPreviewImage(null)} className="fixed inset-0 cursor-pointer z-50 flex items-center justify-center bg-black/60 p-5">
            <div className="relative h-[40vh] w-[30vw] bg-white dark:bg-[#202020] cursor-default flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img src={previewImage} alt="Preview" className="max-h-[80%] max-w-[80%] object-contain" />
            </div>
          </div>
        )}
      </section>
    </>
  );
}
