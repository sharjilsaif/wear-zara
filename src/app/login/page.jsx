"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Skeleton from "@/components/shimmer/shimmer";

import { BiShow, BiHide } from "react-icons/bi";

export default function LogIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [signUp, setSignUp] = useState(false);
  const [password, setPassword] = useState("");
  const [shimmer, setShimmer] = useState(true);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShimmer(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => { setError(false); setSuccess(false); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  useEffect(() => { router.prefetch("/login"); }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) { setError("No account found. Please sign up first."); setSignUp(true); return; }
    if (!email.trim() || !password.trim()) { setError("Please fill the details"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address*"); return; }
    if (email !== storedUser.email && password !== storedUser.password) {
      setError("Details does not match.");
    } else if (email !== storedUser.email) {
      setError("Email address does not match.");
    } else if (password !== storedUser.password) {
      setError("Password does not match.");
    } else {
      setLoading(true);
      setTimeout(() => {
        localStorage.setItem("currentUser", JSON.stringify(storedUser));
        window.dispatchEvent(new Event("auth:change"));
        setError(""); setSuccess(true); setEmail(""); setPassword("");
        router.push("/");
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 bg-white dark:bg-[#0f0f0f] transition-colors duration-300">
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl flex-col overflow-hidden rounded-4xl border border-[#ececec] dark:border-[#1f1f1f] bg-white dark:bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] lg:flex-row transition-colors duration-300">
        <div className="h-64 w-full overflow-hidden lg:h-auto lg:w-[50%]">
          {shimmer ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <img className="h-full w-full object-cover" src="/signUpPageIMG.png" alt="Authentication" />
          )}
        </div>

        <div className="flex w-full items-center justify-center px-6 py-10 sm:px-8 lg:w-[50%] lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-semibold tracking-tight text-[#111111] dark:text-white">Log in to Exclusive</h1>
              <h2 className="text-sm text-[#6b7280] dark:text-[#888]">Enter your details below</h2>
            </div>

            <form onSubmit={handleLogin} noValidate className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#111111] dark:text-[#e5e5e5]">Email</label>
                  <input
                    className={`w-full rounded-2xl border bg-[#f9fafb] dark:bg-[#1a1a1a] text-[#111] dark:text-white placeholder:text-[#9ca3af] dark:placeholder:text-[#555] px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-[#bfbaba] dark:focus:border-[#444] focus:bg-white dark:focus:bg-[#1f1f1f] ${error ? "border-red-400" : "border-[#e5e7eb] dark:border-[#2a2a2a]"}`}
                    placeholder="Email or Phone Number"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <label className="mb-2 block text-sm font-medium text-[#111111] dark:text-[#e5e5e5]">Password</label>
                  <input
                    className={`w-full rounded-2xl border bg-[#f9fafb] dark:bg-[#1a1a1a] text-[#111] dark:text-white placeholder:text-[#9ca3af] dark:placeholder:text-[#555] px-4 py-3 pr-12 text-sm outline-none transition-all duration-300 focus:border-[#bfbaba] dark:focus:border-[#444] focus:bg-white dark:focus:bg-[#1f1f1f] ${error ? "border-red-400" : "border-[#e5e7eb] dark:border-[#2a2a2a]"}`}
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
                  />
                  <div className="absolute right-3 top-[2.7rem] cursor-pointer text-[#6b7280] dark:text-[#888]" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <BiHide /> : <BiShow />}
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-2xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/40 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                  Successfully logged in
                </div>
              )}

              <div className="flex flex-col gap-3 select-none">
                <button
                  type="submit"
                  className={`flex h-11 w-full items-center justify-center rounded-2xl px-6 text-sm font-medium text-white transition-all duration-300 ${loading ? "cursor-not-allowed bg-[#bb3d3d]" : "cursor-pointer bg-[#DB4444] hover:bg-[#d14444]"}`}
                  disabled={loading}
                >
                  {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span> : <span>Log in</span>}
                </button>

                <button type="button" className="flex h-11 w-full items-center justify-center rounded-2xl border border-[#e5e7eb] dark:border-[#2a2a2a] bg-[#f9fafb] dark:bg-[#1a1a1a] px-6 text-sm font-medium text-[#111111] dark:text-[#e5e5e5] transition-all duration-300 hover:bg-white dark:hover:bg-[#252525] cursor-pointer">
                  Forgot Password?
                </button>

                {signUp && (
                  <div className="text-center">
                    <Link href="signUp" className="text-sm font-semibold text-[#111111] dark:text-white transition-all duration-300 hover:text-[#DB4444]">
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
