"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Skeleton from "@/components/shimmer/shimmer";

import { BiShow, BiHide, } from "react-icons/bi";

export default function SignUp() {

  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [shimmer, setShimmer] = useState(true);
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        setShimmer(false);
    }, 400);

    return () => clearTimeout(timer);
    }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(false);
        setSuccess(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const formatName = (value) => {
    return value
      .toLowerCase()
      .split(" ")
      .map(word =>
        word ? word.charAt(0).toUpperCase() + word.slice(1) : ""
      )
      .join(" ");
  };

  useEffect(() => {
    router.prefetch("/login");
  }, [router]);

  const handleSignup = (e)=>{
    e.preventDefault()

    if(!name.trim() || !email.trim() || !password){
      setError("Please fill all the inputs*")
      return
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address*")
      return
    }

    if(password.length < 8){
      setError("Password must be at least 8 characters long*")
      return
    }

    setLoading(true)

    setTimeout(() => {
    const user = {
      name: name.trim(),
      email: email.trim().toLowerCase(), 
      password: password.replace(/\s/g,""),
    }

    localStorage.setItem("user", JSON.stringify(user))

    setError(false)
    setSuccess(true)
    setName("")
    setEmail("")
    setPassword("")
    router.push("/login")
    
      setLoading(false);
    }, 2000);
  }

  return (
    <>
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl flex-col overflow-hidden rounded-4xl border border-[#ececec] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] lg:flex-row">

          <div className="h-64 w-full overflow-hidden lg:h-auto lg:w-[50%]">
            { shimmer ? ( <Skeleton className="h-full w-full bg-[#e4e4e4]"/>

                ) : (<img className="h-full w-full object-cover" src="/signUpPageIMG.png" alt="Authentication" />)}
                <h1 className="mb-2 text-3xl font-semibold tracking-tight text-[#111111]">Create an account</h1>
          </div>
          <div className="flex w-full items-center justify-center px-6 py-10 sm:px-8 lg:w-[50%] lg:px-12">
            <div className="w-full max-w-md">
              <div className="mb-6 select-none cursor-text">
                <h2 className="text-sm text-[#6b7280]">Enter your details below</h2>
              </div>

              <form onSubmit={handleSignup} noValidate className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#111111]">Name</label>
                    <input
                      className={`w-full rounded-2xl border bg-[#f9fafb] px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-[#bfbaba] focus:bg-white ${error ? "border-red-400" : "border-[#e5e7eb]"}`}
                      placeholder="Name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(formatName(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#111111]">Email</label>
                    <input
                      className={`w-full rounded-2xl border bg-[#f9fafb] px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-[#bfbaba] focus:bg-white ${error ? "border-red-400" : "border-[#e5e7eb]"}`}
                      placeholder="Email or Phone Number"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <label className="mb-2 block text-sm font-medium text-[#111111]">Password</label>
                    <input
                      className={`w-full rounded-2xl border bg-[#f9fafb] px-4 py-3 pr-12 text-sm outline-none transition-all duration-300 focus:border-[#bfbaba] focus:bg-white ${error ? "border-red-400" : "border-[#e5e7eb]"}`}
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if(e.key === " "){
                          e.preventDefault()
                        }
                      }}
                    />
                    <div className="absolute right-3 top-[2.7rem] cursor-pointer text-[#6b7280]" onClick={()=> setShowPassword(!showPassword)}>
                        { showPassword ? <BiHide /> : <BiShow /> }
                    </div>
                  </div>
                </div>

                {error && (<div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>)}

                {success && (<div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">Account created successfully</div>)}

                <button type="submit" className={`flex h-11 w-full select-none items-center justify-center rounded-full text-sm font-medium text-white transition-all duration-300 ${loading ? "cursor-not-allowed bg-[#bb3d3d]" : "cursor-pointer bg-[#DB4444] hover:bg-[#d14444]"}`} disabled={loading}>
                  {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span> : <span>Create Account</span>}
                </button>
              </form>

                { shimmer ? (<>
                <Skeleton className="mb-5 mt-3 h-11 w-full rounded-full bg-[#e4e4e4]"/>
                </>) : (<>
                <button className="mt-3 flex h-11 w-full items-center justify-center gap-3 rounded-full border border-[#e5e7eb] bg-white text-sm font-medium text-[#111111] transition-all select-none duration-300 hover:bg-[#fafafa] active:bg-[#f3f4f6]" title="will be soon">
                  <img className="h-5 w-5" src="/google.svg" alt="" />
                  <span>Sign up with Google</span>
                </button>
              </>)}

              <div className="mt-5 flex flex-wrap justify-center gap-2 select-none text-sm text-[#6b7280]">
                <span>Already have an account?</span>
                <Link
                  href="/login"
                  className="font-semibold text-[#111111] transition-all duration-300 hover:text-[#DB4444]"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
