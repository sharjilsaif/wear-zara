"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import Skeleton from "@/components/shimmer/shimmer";

import { IoEyeOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa6";

const LIMIT = 10;

// function ShopNowContent() {
//   const [shimmer, setShimmer] = useState(true);
//   const [products, setProducts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [redHeart, setRedHeart] = useState([]);
//   const [addedCart, setAddedCart] = useState([]);
//   const [previewImage, setPreviewImage] = useState(null);

//   const searchParams = useSearchParams();
//   const title = searchParams.get("title") ?? "Products";
//   const category = searchParams.get("category") ?? "";

//   // Reset when category/title changes
//   useEffect(() => {
//     setProducts([]);
//     setPage(1);
//     setHasMore(false);
//     setShimmer(true);
//   }, [category, title]);

//   // Fetch products — page 1 = initial load, page > 1 = load more
//   useEffect(() => {
//     const fetchProducts = async () => {
//       if (page === 1) {
//         setShimmer(true);
//       } else {
//         setLoadingMore(true);
//       }

//       try {
//         const url = category
//           ? `/api/products?category=${category}&page=${page}&limit=${LIMIT}`
//           : `/api/products?page=${page}&limit=${LIMIT}`;

//         const res = await fetch(url);
//         if (!res.ok) throw new Error("Failed to fetch");
//         const data = await res.json();

//         setHasMore(data.length === LIMIT);
//         setProducts((prev) => page === 1 ? data : [...prev, ...data]);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       } finally {
//         setShimmer(false);
//         setLoadingMore(false);
//       }
//     };

//     fetchProducts();
//   }, [page, category]);

//   // Sync wishlist & cart from localStorage
//   useEffect(() => {
//     const syncStates = () => {
//       const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
//       setRedHeart(savedWishlist.map((item) => item.id));
//       const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
//       setAddedCart(savedCart.map((item) => item.id));
//     };

//     syncStates();
//     window.addEventListener("wishlist-updated", syncStates);
//     window.addEventListener("cart-updated", syncStates);
//     window.addEventListener("storage", syncStates);
//     return () => {
//       window.removeEventListener("wishlist-updated", syncStates);
//       window.removeEventListener("cart-updated", syncStates);
//       window.removeEventListener("storage", syncStates);
//     };
//   }, []);

//   const handleRedHeart = (product) => {
//     const currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
//     const isAlreadySaved = currentWishlist.some((item) => item.id === product.id);
//     let updatedWishlist;

//     if (isAlreadySaved) {
//       updatedWishlist = currentWishlist.filter((item) => item.id !== product.id);
//       setRedHeart((prev) => prev.filter((id) => id !== product.id));
//     } else {
//       updatedWishlist = [...currentWishlist, product];
//       setRedHeart((prev) => [...prev, product.id]);
//     }

//     localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
//     window.dispatchEvent(new Event("wishlist-updated"));
//   };

//   const handleCartToggle = (product) => {
//     const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
//     const isAlreadyInCart = currentCart.some((item) => item.id === product.id);
//     let updatedCart;

//     if (isAlreadyInCart) {
//       updatedCart = currentCart.filter((item) => item.id !== product.id);
//       setAddedCart((prev) => prev.filter((id) => id !== product.id));
//     } else {
//       updatedCart = [...currentCart, { ...product, qty: 1, price: Number(product.price) }];
//       setAddedCart((prev) => [...prev, product.id]);
//     }

//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//     window.dispatchEvent(new Event("cart-updated"));
//   };

//   return (
//     <section className="mx-4 mt-10 mb-16 sm:mx-6 lg:mx-30">

//       {/* Breadcrumb */}
//       <div className="flex items-center gap-2 text-sm text-[#676666] mb-8">
//         <Link href="/" className="hover:text-[#DB4444] transition-colors duration-200">Home</Link>
//         <span>/</span>
//         <span className="text-[#111] dark:text-white">{title}</span>
//       </div>

//       {/* Section label */}
//       <div className="flex items-center gap-2 mb-4">
//         <div className="w-4 h-8 rounded-sm bg-[#DB4444]"></div>
//         <p className="font-semibold text-sm text-[#DB4444]">{title}</p>
//       </div>

//       <p className="font-semibold text-2xl sm:text-3xl mb-10">Explore Latest Products</p>

//       {/* Initial shimmer */}
//       {shimmer ? (
//         <div className="flex flex-wrap justify-center gap-20 md:gap-4 pt-4 pb-12 sm:justify-between">
//           {[...Array(LIMIT)].map((_, i) => (
//             <div key={i} className="h-70 w-full min-w-55 sm:w-[calc(50%-0.75rem)] lg:w-55">
//               <Skeleton className="h-[73%] w-full rounded-2xl" />
//               <Skeleton className="mt-2 h-[5%] w-[70%] rounded-full" />
//               <Skeleton className="mt-3 h-[5%] w-[30%] rounded-full" />
//               <Skeleton className="mt-2 h-[5%] w-[50%] rounded-full" />
//             </div>
//           ))}
//         </div>
//       ) : products.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-24 gap-4">
//           <p className="text-lg font-semibold dark:text-white">No products found</p>
//           <p className="text-sm text-[#676666]">There are no products in this category yet.</p>
//           <Link href="/" className="bg-[#DB4444] hover:bg-[#d14444] active:bg-[#bb3d3d] transition-all duration-300 px-7 py-3 text-sm text-white rounded-md">
//             Back to Home
//           </Link>
//         </div>
//       ) : (
//         <>
//           {/* Products grid */}
//           <div className="flex flex-wrap justify-center gap-20 md:gap-4 pt-4 pb-12 select-none sm:justify-between sm:gap-6 lg:gap-8">
//             {products.map((item) => (
//               <div key={item.id} className="mb-7 h-80 w-full min-w-55 sm:w-[calc(50%-0.75rem)] lg:w-55">
//                 <div className="group relative h-56 w-full dark:bg-[#202020] overflow-hidden rounded-2xl border dark:border-[#525252] border-[#f0f0f0] bg-[#f7f7f7] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
//                   <div className="absolute inset-0 flex items-center justify-center p-4">
//                     <img
//                       className="h-auto max-h-[75%] w-auto max-w-[80%] object-contain transition-all duration-300 group-hover:scale-105"
//                       src={item.imageUrl}
//                       alt={item.name}
//                       onClick={() => setPreviewImage(item.imageUrl)}
//                     />
//                   </div>

//                   <div className="absolute flex w-full justify-between pt-2 px-2">
//                     {item.discountPercentage ? (
//                       <span className="flex h-5 w-10 items-center justify-center rounded-full bg-[#DB4444] text-[10px] font-semibold text-white">
//                         -{item.discountPercentage}%
//                       </span>
//                     ) : (
//                       <div />
//                     )}
//                     <div className="flex flex-col gap-2">
//                       <div
//                         onClick={() => handleRedHeart(item)}
//                         className="flex h-8 w-8 cursor-pointer dark:hover:bg-[#b9b9b9] items-center justify-center rounded-full dark:bg-[#b9b9b9] bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#fff5f5] active:bg-[#ebebeb]"
//                       >
//                         {redHeart.includes(item.id) ? (
//                           <FaHeart className="text-md text-[#DB4444]" />
//                         ) : (
//                           <FaRegHeart className="text-md dark:text-black" />
//                         )}
//                       </div>
//                       <div
//                         onClick={() => setPreviewImage(item.imageUrl)}
//                         className="flex h-8 w-8 cursor-pointer items-center dark:hover:bg-[#b9b9b9] justify-center rounded-full dark:bg-[#b9b9b9] bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#f7f7f7] active:bg-[#ebebeb]"
//                       >
//                         <IoEyeOutline className="text-md dark:text-black" />
//                       </div>
//                     </div>
//                   </div>

//                   <div
//                     onClick={() => handleCartToggle(item)}
//                     className="absolute bottom-0 w-full bg-[#111111] dark:bg-[#b9b9b9] dark:text-black py-2.5 text-center text-sm text-white opacity-0 translate-y-2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 active:text-[#e3e3e3]"
//                   >
//                     {addedCart.includes(item.id) ? "Added to Cart" : "Add to Cart"}
//                   </div>
//                 </div>

//                 <div className="mt-4 flex h-20 flex-col justify-around">
//                   <h1 className="text-sm font-semibold text-[#111111] dark:text-white line-clamp-1">
//                     {item.name}
//                   </h1>
//                   <div className="flex gap-2">
//                     <p className="text-sm font-semibold text-[#DB4444]">${item.price}</p>
//                     {item.discountPrice && (
//                       <p className="text-sm text-[#676666] line-through">${item.discountPrice}</p>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="flex gap-1">
//                       {[...Array(5)].map((_, i) => (
//                         <FaStar key={i} className="text-xs text-yellow-500" />
//                       ))}
//                     </div>
//                     <p className="text-[#676666] text-xs">({item.reviews})</p>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {/* Load more shimmer — appended after existing products */}
//             {loadingMore && (
//               [...Array(LIMIT)].map((_, i) => (
//                 <div key={`shimmer-more-${i}`} className="h-70 w-full min-w-55 sm:w-[calc(50%-0.75rem)] lg:w-55">
//                   <Skeleton className="h-[73%] w-full rounded-2xl" />
//                   <Skeleton className="mt-2 h-[5%] w-[70%] rounded-full" />
//                   <Skeleton className="mt-3 h-[5%] w-[30%] rounded-full" />
//                   <Skeleton className="mt-2 h-[5%] w-[50%] rounded-full" />
//                 </div>
//               ))
//             )}
//           </div>

//           {/* View More button — only shown when there are more products and not currently loading */}
//           {hasMore && !loadingMore && (
//             <div className="flex justify-center mb-8">
//               <button
//                 onClick={() => setPage((prev) => prev + 1)}
//                 className="bg-[#DB4444] hover:bg-[#d14444] active:bg-[#bb3d3d] transition-all duration-300 cursor-pointer px-7 py-3 text-sm text-white rounded-md"
//               >
//                 View More Products
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       {/* Preview Modal */}
//       {previewImage && (
//         <div onClick={() => setPreviewImage(null)} className="fixed inset-0 cursor-pointer z-50 flex items-center justify-center bg-black/60 p-5">
//           <div className="relative h-[40vh] w-[30vw] bg-white dark:bg-[#202020] cursor-default flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
//             <img src={previewImage} alt="Preview" className="max-h-[80%] max-w-[80%] object-contain" />
//           </div>
//         </div>
//       )}

//     </section>
//   );
// }

function ShopNowContent() {
  const [shimmer, setShimmer] = useState(true);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [redHeart, setRedHeart] = useState([]);
  const [addedCart, setAddedCart] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "";
  
  // 1. Get the raw title parameter or auto-generate it from the category slug
  const rawTitle = searchParams.get("title");
  const title = rawTitle 
    ? rawTitle 
    : category 
      ? category.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") 
      : "Products";

  // Reset when category/title changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(false);
    setShimmer(true);
  }, [category, title]); // This will now correctly trigger when the formatted title changes

  // Fetch products — page 1 = initial load, page > 1 = load more
  useEffect(() => {
    const fetchProducts = async () => {
      if (page === 1) {
        setShimmer(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const url = category
          ? `/api/products?category=${category}&page=${page}&limit=${LIMIT}`
          : `/api/products?page=${page}&limit=${LIMIT}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        setHasMore(data.length === LIMIT);
        setProducts((prev) => page === 1 ? data : [...prev, ...data]);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setShimmer(false);
        setLoadingMore(false);
      }
    };

    fetchProducts();
  }, [page, category]);

  // Sync wishlist & cart from localStorage[cite: 2]
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
      updatedCart = [...currentCart, { ...product, qty: 1, price: Number(product.price) }];
      setAddedCart((prev) => [...prev, product.id]);
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  return (
    <section className="mx-4 mt-10 mb-16 sm:mx-6 lg:mx-30">

      <div className="flex items-center gap-2 text-sm text-[#676666] mb-8">
        <Link href="/" className="hover:text-[#DB4444] transition-colors duration-200">Home</Link>
        <span>/</span>
        <span className="text-[#111] dark:text-white">{title}</span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-8 rounded-sm bg-[#DB4444]"></div>
        <p className="font-semibold text-md text-[#DB4444]">{title}</p>
      </div>

      <p className="font-semibold text-2xl sm:text-3xl mb-10">
        Explore Latest Products
      </p>

      {shimmer ? (
        <div className="flex flex-wrap justify-center gap-20 md:gap-4 pt-4 pb-12 sm:justify-between">
          {[...Array(LIMIT)].map((_, i) => (
            <div key={i} className="h-70 w-full min-w-55 sm:w-[calc(50%-0.75rem)] lg:w-55">
              <Skeleton className="h-[73%] w-full rounded-2xl" />
              <Skeleton className="mt-2 h-[5%] w-[70%] rounded-full" />
              <Skeleton className="mt-3 h-[5%] w-[30%] rounded-full" />
              <Skeleton className="mt-2 h-[5%] w-[50%] rounded-full" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-lg font-semibold dark:text-white">No products found</p>
          <p className="text-sm text-[#676666]">There are no products in this category yet.</p>
          <Link href="/" className="bg-[#DB4444] hover:bg-[#d14444] active:bg-[#bb3d3d] transition-all duration-300 px-7 py-3 text-sm text-white rounded-md">
            Back to Home
          </Link>
        </div>
      ) : (
        <>
          {/* Products grid[cite: 2] */}
          <div className="flex flex-wrap justify-center gap-20 md:gap-4 pt-4 pb-12 select-none sm:justify-between sm:gap-6 lg:gap-8">
            {products.map((item) => (
              <div key={item.id} className="mb-7 h-80 w-full min-w-55 sm:w-[calc(50%-0.75rem)] lg:w-55">
                <div className="group relative h-56 w-full dark:bg-[#202020] overflow-hidden rounded-2xl border dark:border-[#525252] border-[#f0f0f0] bg-[#f7f7f7] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center p-0">
                    <img
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
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
                      <div
                        onClick={() => setPreviewImage(item.imageUrl)}
                        className="flex h-8 w-8 cursor-pointer items-center dark:hover:bg-[#b9b9b9] justify-center rounded-full dark:bg-[#b9b9b9] bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#f7f7f7] active:bg-[#ebebeb]"
                      >
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

            {/* Load more shimmer[cite: 2] */}
            {loadingMore && (
              [...Array(LIMIT)].map((_, i) => (
                <div key={`shimmer-more-${i}`} className="h-70 w-full min-w-55 sm:w-[calc(50%-0.75rem)] lg:w-55">
                  <Skeleton className="h-[73%] w-full rounded-2xl" />
                  <Skeleton className="mt-2 h-[5%] w-[70%] rounded-full" />
                  <Skeleton className="mt-3 h-[5%] w-[30%] rounded-full" />
                  <Skeleton className="mt-2 h-[5%] w-[50%] rounded-full" />
                </div>
              ))
            )}
          </div>

          {/* View More button[cite: 2] */}
          {hasMore && !loadingMore && (
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="bg-[#DB4444] hover:bg-[#d14444] active:bg-[#bb3d3d] transition-all duration-300 cursor-pointer px-7 py-3 text-sm text-white rounded-md"
              >
                View More Products
              </button>
            </div>
          )}
        </>
      )}

      {/* Preview Modal[cite: 2] */}
      {previewImage && (
        <div onClick={() => setPreviewImage(null)} className="fixed inset-0 cursor-pointer z-50 flex items-center justify-center bg-black/60 p-5">
          <div className="relative h-[40vh] w-[30vw] bg-white dark:bg-[#202020] cursor-default flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="Preview" className="max-h-[80%] max-w-[80%] object-contain" />
          </div>
        </div>
      )}

    </section>
  );
}

export default function ShopNow() {
  return (
    <Suspense fallback={
      <div className="mx-4 mt-10 sm:mx-6 lg:mx-30">
        <div className="flex flex-wrap justify-center gap-20 md:gap-4 pt-4 pb-12 sm:justify-between">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-70 w-full min-w-55 sm:w-[calc(50%-0.75rem)] lg:w-55">
              <Skeleton className="h-[73%] w-full rounded-2xl" />
              <Skeleton className="mt-2 h-[5%] w-[70%] rounded-full" />
              <Skeleton className="mt-3 h-[5%] w-[30%] rounded-full" />
              <Skeleton className="mt-2 h-[5%] w-[50%] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    }>
      <ShopNowContent />
    </Suspense>
  );
}
