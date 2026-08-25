"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTrashCan, FaStar } from "react-icons/fa6";
import { readStorageList } from "@/lib/localStorageHelpers";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const syncWishlist = () => {
      const savedWishlist = readStorageList("wishlist");
      setWishlist(savedWishlist);
    };

    syncWishlist();

    window.addEventListener("wishlist-updated", syncWishlist);
    window.addEventListener("storage", syncWishlist);

    return () => {
      window.removeEventListener("wishlist-updated", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  const handleRemove = (productId) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    window.dispatchEvent(new Event("wishlist-updated"));
  };

  const handleClearAll = () => {
    setWishlist([]);
    localStorage.removeItem("wishlist");

    window.dispatchEvent(new Event("wishlist-updated"));
  };

  return (
    <section className="mx-4 py-10 sm:mx-6 lg:mx-30">
      <div className="flex items-center gap-2 text-sm text-[#676666] mb-8">
        <Link
          href="/"
          className="hover:text-(--brand-red) transition-colors duration-200"
        >
          Home
        </Link>
        <span>/</span>
        <span className="dark:text-white text-[#111]">Wishlist</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-8 rounded-sm bg-(--brand-red)"></div>
            <p className="font-semibold text-sm text-(--brand-red)">
              Saved
            </p>
          </div>
          <h1 className="text-2xl font-semibold dark:text-white">
            Wishlist ({wishlist.length})
          </h1>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={handleClearAll}
            className="rounded-md border cursor-pointer border-[#e5e7eb] dark:border-[#2a2a2a] px-5 py-2.5 text-sm font-medium text-[#111] dark:text-white transition-all duration-300 hover:bg-(--brand-red) hover:text-white hover:border-(--brand-red) active:bg-(--brand-red-active) active:scale-95"
          >
            Clear All
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center my-30">
          <h1 className="font-semibold text-lg text-gray-500 select-none">
            Your wishlist is empty. Added items will show here.
          </h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 pt-4 pb-12 select-none justify-items-center">
          {wishlist.map((item, index) => (
            <div key={index} className="mb-7 h-70 w-full max-w-55">
              <div className="group relative h-56 w-full cursor-pointer overflow-hidden rounded-2xl border border-[#f0f0f0] dark:border-[#525252] bg-[#f7f7f7] dark:bg-[#202020] p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center p-0">
                  <img
                    className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
                    src={item.imageUrl || item.imgURL}
                    alt={item.title || item.name}
                    onClick={() =>
                      setPreviewImage(item.imageUrl || item.imgURL)
                    }
                  />
                </div>

                <div className="absolute right-2 top-2">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="flex h-8 w-8 items-center justify-center cursor-pointer rounded-full bg-white dark:bg-[#b9b9b9] shadow-sm transition-all duration-300 hover:scale-105 hover:bg-red-50 dark:hover:bg-red-200"
                    title="Remove item"
                  >
                    <FaTrashCan className="text-sm text-gray-500 hover:text-(--brand-red) dark:text-black dark:hover:text-(--brand-red) transition-colors duration-200" />
                  </button>
                </div>

                <div className="absolute bottom-0 w-full bg-[#111111] dark:bg-[#b9b9b9] dark:text-black py-2.5 text-center text-sm text-white opacity-0 translate-y-2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 active:text-[#e3e3e3]">
                  Add to Bag
                </div>
              </div>

              <div className="mt-4 flex h-20 flex-col justify-around">
                <h1 className="text-sm font-semibold text-[#111111] dark:text-white truncate">
                  {item.title || item.name}
                </h1>
                <p className="text-sm font-semibold text-(--brand-red)">
                  ${Number(item.priceNow ?? item.price ?? 0)}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, starIndex) => (
                      <FaStar
                        key={starIndex}
                        className="text-xs text-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="text-[#676666] text-xs">({item.rating})</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          href="/"
          className="bg-(--brand-red) hover:bg-(--brand-red-hover) active:bg-(--brand-red-active) transition-all duration-300 px-8 py-3 text-sm text-white rounded-md"
        >
          Continue Shopping
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
  );
}
