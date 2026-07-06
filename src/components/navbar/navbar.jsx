"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Skeleton from "../shimmer/shimmer";

import { GoHeart } from "react-icons/go";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUser, FaAngleDown } from "react-icons/fa6";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);

  const timerRef = useRef(null);
  const pathname = usePathname();
  const logoutTimerRef = useRef(null);
  const isLoggedIn = currentUser !== null;
  const [shimmer, setShimmer] = useState(true);
  const [language, setLanguage] = useState(false);
  const [logoutBtn, setLogoutBtn] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const syncUser = () => {
    if (typeof window === "undefined") return;

    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShimmer(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    window.dispatchEvent(new Event("auth:change"));
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    setCurrentUser(null);
    setLogoutBtn(false);
    window.dispatchEvent(new Event("auth:change"));
  };

  useEffect(() => {
    syncUser();

    const handleAuthChange = () => syncUser();

    window.addEventListener("auth:change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth:change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const handleClick = () => {
    if (language) {
      setLanguage(false);
      clearTimeout(timerRef.current);
      return;
    }

    setLanguage(true);

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setLanguage(false);
    }, 3000);
  };

  useEffect(() => {
    if (logoutBtn && !isDropdownHovered) {
      logoutTimerRef.current = setTimeout(() => {
        setLogoutBtn(false);
      }, 3000);
    }

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [logoutBtn, isDropdownHovered]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="relative flex h-10 items-center justify-center bg-black px-4 text-sm text-white sm:px-6 lg:px-10">
          {shimmer ? (
            <Skeleton className="absolute left-1/2 h-5 w-[70%] -translate-x-1/2 rounded-full bg-[#414141] sm:w-[35%]" />
          ) : (
            <span className="flex flex-wrap items-center justify-center gap-1 text-center text-xs sm:text-sm">
              <p>Summer Sale for All Swim Suits With Free Delivery - OFF 50%</p>
              <Link
                href="/shopNow?title=Summer%20Sale"
                className="font-semibold underline transition-all duration-300 hover:text-[#d7d7d7] active:text-[#b4b3b3]"
              >
                ShopNow
              </Link>
            </span>
          )}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-6">
            <div
              onClick={handleClick}
              className="flex cursor-pointer items-center gap-2 select-none text-sm transition-all duration-300 hover:text-[#d7d7d7] active:text-[#b4b3b3]"
            >
              <p>English</p>
              <span>
                <FaAngleDown
                  className={`transition-all duration-300 ${language ? "rotate-180" : "rotate-0"}`}
                />
              </span>
            </div>
            <div
              className={`absolute right-0 top-full z-50 mt-2 overflow-hidden rounded-md border border-[#e5e7eb] bg-white text-black shadow-lg transition-all duration-300 ${language ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"}`}
            >
              <button
                onClick={() => setLanguage(false)}
                className="flex h-9 w-20 items-center justify-center text-sm transition-all duration-300 hover:bg-[#f3f3f3] active:bg-[#e5e7eb]"
              >
                English
              </button>
            </div>
          </div>
        </div>

        <nav className="border-b border-[#e5e7eb] bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-30 lg:py-4">
          <div className="flex items-center justify-between gap-3">
            <p className="cursor-pointer select-none text-xl font-semibold tracking-tight sm:text-2xl">
              Wear Zara
            </p>

            <div className="hidden gap-8 lg:flex">
              <Link
                href="/"
                className={`cursor-pointer select-none border-b-2 text-md font-semibold transition-all duration-300 hover:border-[#111111] hover:text-[#111111] active:text-[#858585] ${pathname === "/" ? "border-[#b8b8b8]" : "border-transparent"}`}
              >
                Home
              </Link>

              <Link
                href="/contact"
                className={`cursor-pointer select-none border-b-2 text-md font-semibold transition-all duration-300 hover:border-[#111111] hover:text-[#111111] active:text-[#858585] ${pathname === "/contact" ? "border-[#b8b8b8]" : "border-transparent"}`}
              >
                Contact
              </Link>

              <Link
                href="/about"
                className={`cursor-pointer select-none border-b-2 text-md font-semibold transition-all duration-300 hover:border-[#111111] hover:text-[#111111] active:text-[#858585] ${pathname === "/about" ? "border-[#b8b8b8]" : "border-transparent"}`}
              >
                About
              </Link>

              <Link
                href="/signUp"
                className={`cursor-pointer select-none border-b-2 text-md font-semibold transition-all duration-300 hover:border-[#111111] hover:text-[#111111] active:text-[#858585] ${pathname === "/signUp" ? "border-[#b8b8b8]" : "border-transparent"} ${isLoggedIn ? "hidden" : "block"}`}
              >
                Sign up
              </Link>

              <Link
                href="/login"
                className={`cursor-pointer select-none border-b-2 text-md font-semibold transition-all duration-300 hover:border-[#111111] hover:text-[#111111] active:text-[#858585] ${pathname === "/login" ? "border-[#b8b8b8]" : "border-transparent"} ${isLoggedIn ? "hidden" : "block"}`}
              >
                Log in
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
              <div className="relative hidden md:block md:w-48 lg:w-64">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="h-11 w-full rounded-full border border-[#e5e7eb] bg-[#F5F5F5] pl-4 pr-12 text-sm shadow outline-none transition-all duration-300 focus:border-black"
                />

                <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl transition-all duration-300 active:scale-90" />
              </div>

              <span className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#f3f3f3] hover:text-[#111111] active:scale-95">
                <GoHeart className="cursor-pointer text-2xl transition-all duration-500" />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#f3f3f3] hover:text-[#111111] active:scale-95">
                <IoCartOutline className="cursor-pointer text-2xl transition-all duration-500" />
              </span>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg lg:hidden"
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
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#f3f3f3] hover:text-[#111111] active:scale-95 ${isLoggedIn ? "block" : "hidden"}`}
                >
                  <FaRegUser className="cursor-pointer text-xl transition-all duration-500" />
                </span>

                <div
                  className={`absolute right-0 top-full z-40 mt-6 w-56 overflow-hidden rounded-2xl border border-[#ececec] bg-white p-3 shadow-xl transition-all duration-300 ${logoutBtn ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
                >
                  <div className="rounded-xl bg-[#f7f7f7] px-3 py-3 text-center">
                    <p className="text-sm font-semibold text-[#111111]">
                      {currentUser?.name || "Account"}
                    </p>
                    <p className="mt-1 text-xs text-[#6b7280]">
                      Manage your account
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setLogoutBtn(false);
                      handleLogout();
                    }}
                    className="mt-3 flex w-full cursor-pointer items-center justify-center rounded-full bg-[#111] px-3 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-[#1f1f1f] active:bg-[#505050]"
                  >
                    Logout
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-3 py-2 text-xs font-medium text-[#111111] transition-all duration-300 hover:bg-[#f7f7f7] active:bg-[#ececec]"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[#ececec] bg-[#fafafa] p-4 lg:hidden">
              <Link
                href="/"
                className="font-medium text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/contact"
                className="font-medium text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/about"
                className="font-medium text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              {!isLoggedIn && (
                <>
                  <Link
                    href="/signUp"
                    className="font-medium text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/login"
                    className="font-medium text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
