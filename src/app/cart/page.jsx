
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";
import { FaStar } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const syncCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(savedCart);
    };

    syncCart();

    window.addEventListener("cart-updated", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const updateQty = (id, delta) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, qty: Math.max(1, (item.qty || 1) + delta) } : item
    );
    saveCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    saveCart(updatedCart);
  };

  const handleClearCart = () => {
    saveCart([]); // Sets the React state, clears localStorage, and broadcasts the sync event!
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const total = subtotal;

  if (cart.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center gap-5 py-32 px-4 select-none">
        <div className="flex h-15 w-15 items-center justify-center rounded-full bg-[#f7f7f7] dark:bg-[#202020]">
          <IoCartOutline className="text-3xl text-[#e97f7f]" />
        </div>
        <h1 className="text-2xl font-semibold dark:text-white">Your cart is empty</h1>
        <p className="text-sm text-[#676666]">Looks like you haven't added anything yet.</p>
        <Link href="/" className="bg-[#DB4444] hover:bg-[#d14444] active:bg-[#bb3d3d] transition-all duration-300 px-8 py-3 text-sm text-white rounded-md cursor-pointer">
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-4 py-10 sm:mx-6 lg:mx-30">

      <div className="flex items-center gap-2 text-sm text-[#676666] mb-8">
        <Link href="/" className="hover:text-[#DB4444] transition-colors duration-200 cursor-pointer">Home</Link>
        <span>/</span>
        <span className="dark:text-white text-[#111]">Cart</span>
      </div>

      <div className="flex flex-col gap-8 xl:flex-row xl:items-start">

        <div className="flex-1">

          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 rounded-xl bg-white dark:bg-[#1a1a1a] border border-[#f0f0f0] dark:border-[#2a2a2a] px-6 py-4 shadow-sm text-sm font-semibold text-[#111] dark:text-white mb-4">
            <span>Product</span>
            <span className="text-center">Price</span>
            <span className="text-center">Quantity</span>
            <span className="text-center">Subtotal</span>
          </div>

          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div key={item.id} className="grid grid-cols-[auto_1fr] sm:grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center rounded-xl bg-white dark:bg-[#1a1a1a] border border-[#f0f0f0] dark:border-[#2a2a2a] px-4 sm:px-6 py-4 shadow-sm transition-all duration-300 hover:shadow-md">

                <div className="flex items-center gap-4 col-span-1">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#f7f7f7] dark:bg-[#202020] border border-[#f0f0f0] dark:border-[#525252] p-2">
                    <img src={item.imgURL} alt={item.title} className="h-full w-full object-contain" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-sm font-semibold text-[#111] dark:text-white leading-tight">{item.title}</h2>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => <FaStar key={i} className="text-[10px] text-yellow-500" />)}
                      <span className="text-[10px] text-[#676666]">({item.rating})</span>
                    </div>  
                    <p className="text-sm font-semibold text-[#DB4444] sm:hidden">${item.price}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:hidden col-span-1">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQty(item.id, -1)} 
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e5e7eb] dark:border-[#2a2a2a] bg-[#f7f7f7] dark:bg-[#252525] text-[#111] dark:text-white text-sm font-bold transition-all duration-200 hover:bg-[#ececec] dark:hover:bg-[#333] active:scale-95 cursor-pointer leading-none pb-0.5"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold dark:text-white">{item.qty || 1}</span>
                    <button 
                      onClick={() => updateQty(item.id, 1)} 
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e5e7eb] dark:border-[#2a2a2a] bg-[#f7f7f7] dark:bg-[#252525] text-[#111] dark:text-white text-sm font-bold transition-all duration-200 hover:bg-[#ececec] dark:hover:bg-[#333] active:scale-95 cursor-pointer leading-none"
                    >
                      +
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="flex h-8 w-8 items-center justify-center rounded-full text-[#676666] hover:text-[#DB4444] hover:bg-[#fff0f0] dark:hover:bg-[#2a1a1a] transition-all duration-200 cursor-pointer">
                    <FiTrash2 className="text-base" />
                  </button>
                </div>

                <p className="hidden sm:block text-center text-sm font-semibold text-[#DB4444]">${item.price}</p>

                <div className="hidden sm:flex items-center justify-center gap-2">
                  <button 
                    onClick={() => updateQty(item.id, -1)} 
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e5e7eb] dark:border-[#2a2a2a] bg-[#f7f7f7] dark:bg-[#252525] text-[#111] dark:text-white text-sm font-bold transition-all duration-200 hover:bg-[#ececec] dark:hover:bg-[#333] active:scale-95 cursor-pointer leading-none pb-0.5"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-semibold dark:text-white">{item.qty || 1}</span>
                  <button 
                    onClick={() => updateQty(item.id, 1)} 
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e5e7eb] dark:border-[#2a2a2a] bg-[#f7f7f7] dark:bg-[#252525] text-[#111] dark:text-white text-sm font-bold transition-all duration-200 hover:bg-[#ececec] dark:hover:bg-[#333] active:scale-95 cursor-pointer leading-none"
                  >
                    +
                  </button>
                </div>

                <div className="hidden sm:flex items-center justify-center gap-3">
                  <p className="text-sm font-semibold text-[#111] dark:text-white">${item.price * (item.qty || 1)}</p>
                  <button onClick={() => removeItem(item.id)} className="flex h-8 w-8 items-center justify-center rounded-full text-[#676666] hover:text-[#DB4444] hover:bg-[#fff0f0] dark:hover:bg-[#2a1a1a] transition-all duration-200 cursor-pointer">
                    <FiTrash2 className="text-base" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link href="/" className="flex items-center justify-center rounded-md border border-[#e5e7eb] dark:border-[#2a2a2a] px-6 py-3 text-sm font-medium text-[#111] dark:text-white transition-all duration-300 hover:bg-[#f7f7f7] dark:hover:bg-[#1a1a1a] active:scale-95 cursor-pointer">
              ← Return To Shop
            </Link>
            
            <button 
              onClick={handleClearCart} 
              className="flex items-center justify-center rounded-md border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10 px-6 py-3 text-sm font-medium text-[#DB4444] transition-all duration-300 hover:bg-red-100 dark:hover:bg-red-950/30 active:scale-95 cursor-pointer"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="w-full xl:w-80 shrink-0">
          <div className="rounded-2xl border border-[#f0f0f0] dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#111] dark:text-white mb-5">Cart Total</h2>

            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between border-b border-[#f0f0f0] dark:border-[#2a2a2a] pb-4">
                <span className="text-[#676666]">Subtotal</span>
                <span className="font-semibold text-[#111] dark:text-white">${subtotal}</span>
              </div>
              <div className="flex justify-between border-b border-[#f0f0f0] dark:border-[#2a2a2a] pb-4">
                <span className="text-[#676666]">Shipping</span>
                <span className="font-semibold text-green-500">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#111] dark:text-white">Total</span>
                <span className="font-semibold text-[#111] dark:text-white">${total}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <input
                type="text"
                placeholder="Coupon Code"
                className="h-11 flex-1 rounded-md border border-[#e5e7eb] dark:border-[#2a2a2a] bg-[#f5f5f5] dark:bg-[#252525] px-4 text-sm text-[#111] dark:text-white placeholder:text-[#9ca3af] dark:placeholder:text-[#555] outline-none transition-all duration-300 focus:border-black dark:focus:border-[#555]"
              />
              <button className="rounded-md bg-[#DB4444] hover:bg-[#d14444] active:bg-[#bb3d3d] transition-all duration-300 px-4 text-sm text-white cursor-pointer">
                Apply
              </button>
            </div>

            <button className="mt-5 w-full rounded-md bg-[#DB4444] hover:bg-[#d14444] active:bg-[#bb3d3d] transition-all duration-300 py-3 text-sm font-medium text-white cursor-pointer">
              Proceed to Checkout
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}