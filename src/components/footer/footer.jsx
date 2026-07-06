"use client"

import { useState, useEffect } from "react";
import Link from "next/link";

import Skeleton from "../shimmer/shimmer";

import { BiLogoPlayStore } from "react-icons/bi";
import { LuSendHorizontal } from "react-icons/lu";
import { FaApple, FaInstagram } from "react-icons/fa";
import { FaFacebookF, FaXTwitter, FaLinkedinIn, } from "react-icons/fa6";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);
    const [shimmer, setShimmer] = useState(true);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            setSuccess(false)
          }, 4000);
    
          return () => clearTimeout(timer);
        }
      }, [error, success]);
    
    const handleSubmit = (e) => {
    e.preventDefault();

    if(isSubmitting){
        setIsSubmitting(false)
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError(true);
        return;
    }

    setError(false);
    setIsSubmitting(true);

    setTimeout(() => {
        setIsSubmitting(false);
        setEmail("");
        setSuccess(true);
    }, 2000);
    };

  return (
    <>
     <section className="bg-black py-18 px-10">

       <div className="text-white flex gap-5 justify-evenly">

            <div className="flex flex-col gap-5">
                { shimmer ? (<>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <div className="mt-4 flex flex-col gap-5">
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                </div>
                </>) : (<>
                <p className="text-xl font-semibold select-none">Wear Zara</p>
                <div className="flex flex-col gap-3">
                    <p className="text-sm cursor-pointer select-none active:text-[#9d9d9d] hover:text-[#d0d0d0] w-fit">Subscribe</p>
                    <p className="text-sm select-none">Get 10% off your first order</p>
                    <form onSubmit={handleSubmit} noValidate className="flex items-center border gap-2 w-52 py-1.5 px-2 rounded-sm mt-1.5">
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-40 text-sm border-none outline-none focus:outline-none focus:ring-0" type="email" placeholder="Enter your email" />
                        <div className="l">
                            { isSubmitting ? <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></div> : <LuSendHorizontal type="submit" onClick={handleSubmit} className="text-lg cursor-pointer active:text-black transition-all duration-400"/>}
                        </div>
                    </form>
                    {error && (<div className="text-sm text-red-400">Enter a valid email address*</div>)}
                    {success && (<div className="text-sm text-green-400">Subscribed Successfully!</div>)}
                </div>
                </>)}
            </div>

            <div className="flex flex-col gap-5">
                { shimmer ? (<>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <div className="mt-4 flex flex-col gap-5">
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                </div>
                </>) : (<>
                <p className="text-xl font-semibold select-none">Support</p>
                <div className="flex flex-col gap-3 justifyc">
                    <p className="text-sm">12 Baker Street London<br/>Greater England UK</p>
                    <p className="text-sm">wearzara@gmail.com</p>
                    <p className="text-sm">+123 456 789</p>
                </div>
                </>)}
            </div>

            <div className="flex flex-col gap-5">
                { shimmer ? (<>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <div className="mt-4 flex flex-col gap-5">
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                </div>
                </>) : (<>
                <p className="text-xl font-semibold select-none">Account</p>
                <div className="flex flex-col gap-3">
                    <p className="text-sm cursor-pointer select-none active:text-[#9d9d9d] hover:text-[#d0d0d0] w-fit">My Account</p>
                    <Link href="/signUp" className="text-sm cursor-pointer select-none active:text-[#9d9d9d] hover:text-[#d0d0d0] w-fit">Login / Register</Link>
                    <p className="text-sm cursor-pointer select-none active:text-[#9d9d9d] hover:text-[#d0d0d0] w-fit">Cart</p>
                    <p className="text-sm cursor-pointer select-none active:text-[#9d9d9d] hover:text-[#d0d0d0] w-fit">Wishlist</p>
                    <Link href="/shopNow?title=Latest" className="text-sm cursor-pointer select-none active:text-[#9d9d9d] hover:text-[#d0d0d0] w-fit">Shop</Link>
                </div>
                </>)}
            </div>

            <div className="flex flex-col gap-5">
                { shimmer ? (<>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <div className="mt-4 flex flex-col gap-5">
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                </div>
                </>) : (<>
                <p className="text-xl font-semibold select-none">Quick Link</p>
                <div className="flex flex-col gap-3">
                    <p className="text-sm cursor-pointer select-none active:text-[#9d9d9d] hover:text-[#d0d0d0] w-fit">Privacy Policy</p>
                    <p className="text-sm cursor-pointer select-none active:text-[#9d9d9d] hover:text-[#d0d0d0] w-fit">Terms of Use</p>
                    <p className="text-sm cursor-pointer select-none active:text-[#9d9d9d] hover:text-[#d0d0d0] w-fit">FAQs</p>
                    <Link href="/contact" className="text-sm cursor-pointer select-none active:text-[#9d9d9d] hover:text-[#d0d0d0] w-fit">Contact</Link>
                </div>
                </>)}
            </div>

            <div className="flex flex-col gap-5">
                { shimmer ? (<>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <div className="mt-4 flex flex-col gap-5">
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                <Skeleton className="w-30 h-4 bg-[#313131] rounded-sm"/>
                </div>
                </>) : (<>
                <p className="text-xl font-semibold text-center select-none">Download App</p>
                <div className="flex flex-col gap-5 items-center">
                    <div className="flex gap-2 border w-34 p-1 rounded-md border-[#e3e3e3] transition-all duration-300 cursor-pointer active:bg-[#3d3d3d] select-none">
                        <span className=""><BiLogoPlayStore className="text-4xl"/></span>
                        <span className="">
                            <p className="text-xs">Get it on</p>
                            <p className="text-sm font-semibold">Google Play</p>
                        </span>
                    </div>
                    <div className="flex gap-2 border w-34 p-1 rounded-md border-[#e3e3e3] transition-all duration-300 cursor-pointer active:bg-[#3d3d3d] select-none">
                        <span className=""><FaApple className="text-4xl"/></span>
                        <span className="">
                            <p className="text-xs">Download on</p>
                            <p className="text-sm font-semibold">App Store</p>
                        </span>
                    </div>
                    <div className="flex gap-6">
                        <span className=""><FaFacebookF className="text-xl cursor-pointer active:text-[#d0d0d0]"/></span>
                        <span className=""><FaXTwitter className="text-xl cursor-pointer active:text-[#d0d0d0]"/></span>
                        <span className=""><FaInstagram className="text-xl cursor-pointer active:text-[#d0d0d0]"/></span>
                        <span className=""><FaLinkedinIn className="text-xl cursor-pointer active:text-[#d0d0d0]"/></span>
                    </div>
                </div>
                </>)}
            </div>
        
       </div>

     </section>
    </>
  );
}
