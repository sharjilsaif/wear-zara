"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import Skeleton from "@/components/shimmer/shimmer";

import { IoEyeOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa6";

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

function ShopNowContent() {
  const [shimmer, setShimmer] = useState(true);
  const [redHeart, setRedHeart] = useState([]);
  const [addedCart, setAddedCart] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [displayProducts, setDisplayProducts] = useState([]);

  const searchParams = useSearchParams();
  const title = searchParams.get("title") ?? "Products";

  useEffect(() => {
    const randomProducts = [...ourProducts].sort(() => Math.random() - 0.5);
    setDisplayProducts(randomProducts);

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

  useEffect(() => {
    const timer = setTimeout(() => setShimmer(false), 400);
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

  const handleViewMore = () => {
    setLoadingMore(true);

    setTimeout(() => {
      const randomProducts = [...ourProducts].sort(() => Math.random() - 0.5);

      setDisplayProducts((prev) => [...prev, ...randomProducts]);
      setLoadingMore(false);
    }, 3000);
  };

  return (
    <section className="mx-4 mt-10 mb-16 sm:mx-6 sm:mt-12 lg:mx-30 lg:mt-15 lg:mb-25">
      <div className="text-[#807f7f] mb-8 lg:mb-15">
        <Link className="hover:text-[#DB4444] transition-all duration-300" href="/">
          Home
        </Link>
        <span> / </span>
        <span className="text-[#111] dark:text-white">{title}</span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-8 rounded-sm bg-[#DB4444]"></div>
        <p className="font-semibold text-sm text-[#DB4444]">{title}</p>
      </div>

      <p className="font-semibold text-3xl text-start">
        Explore Latest Products
      </p>

      <div className="flex flex-wrap justify-center gap-20 md:gap-4 pt-10 pb-12 select-none sm:justify-between lg:pt-15">
        {shimmer ? (
          [...Array(10)].map((_, index) => (
            <div key={index} className="h-70 w-55">
              <Skeleton className="h-[75%] w-full rounded-2xl" />
              <Skeleton className="mt-2 h-[6%] w-[70%] rounded-full" />
              <Skeleton className="mt-3 h-[6%] w-[30%] rounded-full" />
              <Skeleton className="mt-2 h-[6%] w-[50%] rounded-full" />
            </div>
          ))
        ) : (
          <>
            {displayProducts.map((item, index) => (
              <div key={index} className="h-70 w-55 mb-10">
                <div className="group relative h-56 w-full cursor-pointer overflow-hidden rounded-2xl border border-[#f0f0f0] dark:border-[#525252] bg-[#f7f7f7] dark:bg-[#202020] p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <img
                      className="h-auto max-h-[75%] w-auto max-w-[80%] object-contain transition-all duration-300 group-hover:scale-105"
                      src={item.imgURL}
                      alt={item.title}
                      onClick={() => setPreviewImage(item.imgURL)}
                    />
                  </div>

                  <div className="absolute right-2 top-2 flex flex-col gap-2">
                    <div
                      onClick={() => handleRedHeart(item)}
                      className="flex h-8 w-8 cursor-pointer items-center dark:bg-[#b9b9b9] dark:hover:bg-[#b9b9b9] justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#fff5f5] active:bg-[#ebebeb]"
                    >
                      {redHeart.includes(item.title) ? (
                        <FaHeart className="text-md text-[#DB4444]" />
                      ) : (
                        <FaRegHeart className="text-md dark:text-black" />
                      )}
                    </div>
                    <div className="flex h-8 w-8 cursor-pointer dark:bg-[#b9b9b9] dark:hover:bg-[#b9b9b9] items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#f7f7f7] active:bg-[#ebebeb]">
                      <IoEyeOutline className="text-md dark:text-black" />
                    </div>
                  </div>

                  <div
                    onClick={() => handleCartToggle(item)}
                    className="absolute bottom-0 w-full bg-[#111111] dark:bg-[#b9b9b9] dark:text-black py-2.5 text-center text-sm text-white opacity-0 translate-y-2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 active:text-[#e3e3e3]"
                  >
                    {addedCart.includes(item.title) ? "Added to Cart" : "Add to Cart"}
                  </div>
                </div>

                <div className="mt-4 flex h-20 flex-col justify-around">
                  <h1 className="text-sm font-semibold text-[#111111] dark:text-white">
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
              <Skeleton className="h-[75%] w-full rounded-2xl" />
              <Skeleton className="mt-2 h-[6%] w-[70%] rounded-full" />
              <Skeleton className="mt-3 h-[6%] w-[30%] rounded-full" />
              <Skeleton className="mt-2 h-[6%] w-[50%] rounded-full" />
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

      {previewImage && (<div onClick={() => setPreviewImage(null)} className="fixed inset-0 cursor-pointer z-50 flex items-center justify-center bg-black/60 p-5">

          <div className="relative h-[40vh] w-[30vw] bg-white dark:bg-[#202020] cursor-default flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="Preview" className="max-h-[80%] max-w-[80%] object-contain"/>
          </div>

        </div>)}  
      
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