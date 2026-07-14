"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";

import Skeleton from "../shimmer/shimmer";

import { GoHeart } from "react-icons/go";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUser, FaAngleDown } from "react-icons/fa6";

export default function Navbar() {

  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const timerRef = useRef(null);
  const pathname = usePathname();
  const logoutTimerRef = useRef(null);
  
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = theme === "dark";

  const [shimmer, setShimmer] = useState(true);
  const [language, setLanguage] = useState(false);
  const [logoutBtn, setLogoutBtn] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [isLangHovered, setIsLangHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShimmer(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (!response.ok) return;

      setShowDeleteModal(false);
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = () => {
    setLanguage((prev) => !prev);
    clearTimeout(timerRef.current);
  };

  useEffect(() => {
    if (language && !isLangHovered) {
      timerRef.current = setTimeout(() => setLanguage(false), 3000);
    }
    return () => clearTimeout(timerRef.current);
  }, [language, isLangHovered]);

  useEffect(() => {
    if (logoutBtn && !isDropdownHovered) {
      logoutTimerRef.current = setTimeout(() => setLogoutBtn(false), 3000);
    }
    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [logoutBtn, isDropdownHovered]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0f0f0f] shadow-sm dark:shadow-[0_1px_0_rgba(255,255,255,0.06)] transition-colors duration-300">

        <div className="relative flex h-10 items-center justify-center bg-black dark:bg-white px-4 text-sm text-white dark:text-black sm:px-6 lg:px-10 transition-colors duration-300">
          {shimmer ? (
            <Skeleton className="h-5 w-[70%] rounded-md sm:w-[35%]" />
          ) : (
            <span className="flex flex-wrap items-center justify-center gap-1 text-center text-xs sm:text-sm">
              <p>Summer Sale for All Swim Suits With Free Delivery - OFF 50%</p>
              <Link href="/shopNow?title=Summer%20Sale" className="font-semibold dark:hover:text-[#4e4d4d] underline transition-all duration-300 hover:text-[#d7d7d7] active:text-[#b4b3b3]">
                ShopNow
              </Link>
            </span>
          )}

          <div className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-3 sm:right-6 lg:right-30">

            <div onClick={() => setTheme(isDark ? "light" : "dark")} className="relative flex h-6 w-12 sm:h-7 sm:w-14 cursor-pointer items-center rounded-full border border-white/40 bg-white/40 dark:bg-black/40  px-0.5 backdrop-blur-xl transition-all duration-500  active:scale-95">

              <div className={`absolute h-5 w-5 sm:h-6 sm:w-6 rounded-full border border-white/30 backdrop-blur-2xl transition-all duration-500 ease-in-out ${isDark ? "left-[calc(100%-1.375rem)] sm:left-[calc(100%-1.625rem)] bg-[#1a1a2e] shadow-[0_2px_8px_rgba(0,0,0,0.5)]" : "left-0.5 bg-white/80 shadow-[0_2px_8px_rgba(255,255,255,0.4)]"}`} />

              <div className="relative z-10 flex w-1/2 justify-center">
                <span className={`text-[11px] sm:text-xs transition-all duration-500 ${isDark ? "opacity-30" : "opacity-100"}`}>☀️</span>
              </div>

              <div className="relative z-10 flex w-1/2 justify-center">
                <span className={`text-[11px] sm:text-xs transition-all duration-500 ${isDark ? "opacity-100" : "opacity-30"}`}>🌙</span>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-b from-white/20 via-transparent to-transparent" />
            </div>
            
            <div onClick={handleClick} className="flex cursor-pointer select-none items-center gap-2 text-sm transition-all duration-300 hover:text-[#d7d7d7] active:text-[#b4b3b3]">
              <p>English</p>
              <FaAngleDown className={`transition-all duration-300 ${language ? "rotate-180" : "rotate-0"}`} />
            </div>
          </div>
        </div>

        <div
          onMouseEnter={() => setIsLangHovered(true)}
          onMouseLeave={() => setIsLangHovered(false)}
          className={`hidden md:block absolute right-2 z-70 mt-1 overflow-hidden rounded-md border border-[#e5e7eb] dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-black dark:text-white shadow-lg transition-all duration-300 sm:right-6 ${
            language ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
          }`}
        >
          <button
            onClick={() => setLanguage(false)}
            className="flex h-9 w-20 items-center justify-center text-sm cursor-pointer transition-all duration-300 hover:bg-[#f3f3f3] dark:hover:bg-[#2a2a2a] active:bg-[#e5e7eb]"
          >
            English
          </button>
        </div>

        <nav className="border-b border-[#e5e7eb] dark:border-[#525252] bg-white/95 dark:bg-[#0f0f0f]/80 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-30 lg:py-4 transition-colors duration-300">
          <div className="flex items-center justify-between gap-3">
            <p className="cursor-pointer select-none text-xl font-semibold tracking-tight sm:text-2xl text-[#111] dark:text-white">
              Wear Zara
            </p>

            <div className="hidden gap-8 lg:flex">
              <Link href="/" className={`cursor-pointer select-none border-b-2 text-md font-semibold transition-all duration-300 text-[#111] dark:text-[#e5e5e5] hover:border-[#111111] dark:hover:text-[#c6c5c5] active:text-[#858585] ${pathname === "/" ? "border-[#b8b8b8]" : "border-transparent"}`}>Home</Link>

              <Link href="/contact" className={`cursor-pointer select-none border-b-2 text-md font-semibold transition-all duration-300 text-[#111] dark:text-[#e5e5e5] hover:border-[#111111] dark:hover:text-[#c6c5c5] active:text-[#858585] ${pathname === "/contact" ? "border-[#b8b8b8]" : "border-transparent"}`}
              >Contact</Link>

              <Link href="/about" className={`cursor-pointer select-none border-b-2 text-md font-semibold transition-all duration-300 text-[#111] dark:text-[#e5e5e5] hover:border-[#111111] dark:hover:text-[#c6c5c5] active:text-[#858585] ${pathname === "/about" ? "border-[#b8b8b8]" : "border-transparent" }`}>About</Link>

              {!isLoggedIn && (
                <>
                  <Link href="/signUp" className={`cursor-pointer select-none border-b-2 text-md font-semibold transition-all duration-300 text-[#111] dark:text-[#e5e5e5] hover:border-[#111111] dark:hover:text-[#c6c5c5] active:text-[#858585] ${pathname === "/signUp" ? "border-[#b8b8b8]" : "border-transparent"}`}>Sign Up</Link>

                  <Link href="/login" className={`cursor-pointer select-none border-b-2 text-md font-semibold transition-all duration-300 text-[#111] dark:text-[#e5e5e5] hover:border-[#111111] dark:hover:text-[#c6c5c5] active:text[#858585] ${pathname === "/login" ? "border-[#b8b8b8]" : "border-transparent"}`}>Log In</Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
              <div className="relative hidden md:block md:w-48 lg:w-64">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="h-11 w-full rounded-full border border-[#e5e7eb] dark:border-[#2a2a2a] bg-[#F5F5F5] dark:bg-[#1a1a1a] text-[#111] dark:text-white placeholder:text-[#9ca3af] dark:placeholder:text-[#555] pl-4 pr-12 text-sm shadow outline-none transition-all duration-300 focus:border-black dark:focus:border-[#555]"
                />
                <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-[#111] dark:text-[#aaa] transition-all duration-300 active:scale-90" />
              </div>

              <Link href="/wishlist" className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#f3f3f3] dark:hover:bg-[#1f1f1f] text-[#111] dark:text-white active:scale-95">
                <GoHeart className="cursor-pointer text-2xl" />
              </Link>
              <Link href="/cart" className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#f3f3f3] dark:hover:bg-[#1f1f1f] text-[#111] dark:text-white active:scale-95">
                <IoCartOutline className="cursor-pointer text-2xl" />
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#111] dark:text-white lg:hidden"
              >
                {isMenuOpen ? <FiX /> : <FiMenu />}
              </button>

              <div
                onMouseEnter={() => setIsDropdownHovered(true)}
                onMouseLeave={() => setIsDropdownHovered(false)}
                className="relative"
              >
                <span
                  onClick={() => setLogoutBtn(!logoutBtn)}
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#f3f3f3] dark:hover:bg-[#1f1f1f] text-[#111] dark:text-white active:scale-95 ${isLoggedIn ? "block" : "hidden"}`}
                >
                  <FaRegUser className="cursor-pointer text-xl" />
                </span>

                <div className={`absolute right-0 top-full z-40 mt-6 w-56 overflow-hidden rounded-2xl border border-[#ececec] dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] p-3 shadow-xl transition-all duration-300 ${logoutBtn ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}>
                  <div className="rounded-xl bg-[#f7f7f7] dark:bg-[#252525] px-3 py-3 text-center">
                    <p className="text-sm font-semibold text-[#111111] dark:text-white">
                      {session?.user?.name || "Account"}
                    </p>
                    <p className="mt-1 text-xs text-[#6b7280] dark:text-[#888]">Manage your account</p>
                  </div>
                  <button
                    onClick={() => { setLogoutBtn(false); setModalType("logout"); setShowDeleteModal(true);}}
                    className="mt-3 flex w-full cursor-pointer items-center justify-center rounded-full bg-[#111] dark:bg-white px-3 py-2 text-xs font-medium text-white dark:text-[#111] transition-all duration-300 hover:bg-[#1f1f1f] dark:hover:bg-[#e5e5e5] active:bg-[#505050]"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => { setModalType("delete"); setShowDeleteModal(true);}}
                    className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-full border border-[#e5e7eb] dark:border-[#2a2a2a] bg-white dark:bg-transparent px-3 py-2 text-xs font-medium text-[#111111] dark:text-[#e5e5e5] transition-all duration-300 hover:bg-[#f7f7f7] dark:hover:bg-[#252525] active:bg-[#ececec]"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[#ececec] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#1a1a1a] p-4 lg:hidden">
              <Link href="/" className="font-medium text-sm text-[#111] dark:text-[#e5e5e5]" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link href="/contact" className="font-medium text-sm text-[#111] dark:text-[#e5e5e5]" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <Link href="/about" className="font-medium text-sm text-[#111] dark:text-[#e5e5e5]" onClick={() => setIsMenuOpen(false)}>About</Link>
              {!isLoggedIn && (
                <>
                  <Link href="/signUp" className="font-medium text-sm text-[#111] dark:text-[#e5e5e5]" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
                  <Link href="/login" className="font-medium text-sm text-[#111] dark:text-[#e5e5e5]" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                </>
              )}
              <button onClick={() => {setTheme(isDark ? "light" : "dark"); setIsMenuOpen(false);}} className="text-left font-medium text-sm text-[#111] dark:text-[#e5e5e5] cursor-pointer">
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          )}
        </nav>
      </header>

      {showDeleteModal && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-[90%] max-w-md rounded-3xl bg-white dark:bg-[#1a1a1a] p-6 shadow-2xl">

            <h2 className="text-xl font-semibold text-[#111] dark:text-white">
              {modalType === "delete" ? "Delete Account" : "Logout"}
            </h2>

            <p className="mt-3 text-sm text-[#666] dark:text-[#aaa]">
              {modalType === "delete" ? "Are you sure you want to permanently delete your account? This action cannot be undone." : "Are you sure you want to log out of your account?"}
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-full border border-gray-300 px-5 py-2 text-sm transition hover:bg-gray-100 dark:border-[#333] dark:hover:bg-[#252525] cursor-pointer"
              >
                {modalType === "delete" ? "Cancel" : "Stay Logged In"}
              </button>

              <button
                onClick={() => {
                          if (modalType === "delete") {
                            handleDeleteAccount();
                          } else {
                            handleLogout();
                            setShowDeleteModal(false);
                          }
                        }}
                className="rounded-full bg-red-600 px-5 py-2 text-sm text-white transition hover:bg-red-700 cursor-pointer"
              >
                {modalType === "delete" ? "Delete" : "Logout"}
              </button>

            </div>
          </div>
        </div>
      )}
      
    </>
  );
}