"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import Skeleton from "@/components/shimmer/shimmer";

export default function ProductDetails() {

  const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        setShimmer(false);
    }, 400);

    return () => clearTimeout(timer);
    }, []);
    
  return (
    <>
     <section className="mx-30 my-20">

        <div className="w-full h-110 bg-black flex rounded-lg">
            <div className="w-[50%] pl-15 py-0 flex flex-col justify-center">
                <h1 className="text-[#eb4848]">Categories</h1>
                {shimmer ? (<>
                    <Skeleton className="w-[55%] h-11 mt-5 mb-3 bg-[#414141] rounded-xl" />
                    <Skeleton className="w-[70%] h-11 mb-8 bg-[#414141] rounded-xl" />
                </>) : (<>
                <h1 className="text-white text-5xl font-semibold mb-8 mt-5 tracking-wide">Enhance Your<br/>Music Experience</h1>
                </>)}

                <div className="flex gap-7 mb-8">
                    {shimmer ? (<>
                    <Skeleton className="w-13 h-13 rounded-full bg-[#414141]" />
                    <Skeleton className="w-13 h-13 rounded-full bg-[#414141]" />
                    <Skeleton className="w-13 h-13 rounded-full bg-[#414141]" />
                    <Skeleton className="w-13 h-13 rounded-full bg-[#414141]" />
                    </>) : (<>
                    <div className="bg-white cursor-pointer w-18 h-11 rounded-full flex flex-col items-center justify-center gap-1 leading-none">
                        <span className="font-bold text-sm leading-none">23</span>
                        <span className="text-xs leading-none">Hours</span>
                    </div>
                    <div className="bg-white cursor-pointer w-18 h-11 rounded-full flex flex-col items-center justify-center gap-1 leading-none">
                        <span className="font-bold text-sm leading-none">05</span>
                        <span className="text-xs leading-none">Days</span>
                    </div>
                    <div className="bg-white cursor-pointer w-18 h-11 rounded-full flex flex-col items-center justify-center gap-1 leading-none">
                        <span className="font-bold text-sm leading-none">59</span>
                        <span className="text-xs leading-none">Minutes</span>
                    </div>
                    <div className="bg-white cursor-pointer w-18 h-11 rounded-full flex flex-col items-center justify-center gap-1 leading-none">
                        <span className="font-bold text-sm leading-none">35</span>
                        <span className="text-xs leading-none">Seconds</span>
                    </div>
                    </>)}
                </div>

                {shimmer ? (
                  <Skeleton className="w-[25%] h-12 bg-[#414141] rounded-md" />
              ) : (<>
                <Link href="/shopNow?title=Speakers%20Electronics" className="bg-[#DB4444] hover:bg-[#d14444] active:bg-[#bb3d3d] transition-all duration-300 cursor-pointer px-10 w-fit py-3 text-sm text-white rounded-md">Buy Now!</Link>
              </>)}
            </div>
            
            <div className="w-[50%] relative flex items-center justify-center group">
                <div className="absolute bg-[#878585] transition-all duration-300 w-[80%] h-[90%] group-hover:w-[90%] group-hover:h-[95%] blur-3xl group-hover:blur-1xl opacity-50 rounded-full"/>
                {shimmer ? (
                  <Skeleton className="w-[80%] h-[70%] bg-[#111] rounded-full" />
              ) : (<>
                <img className="relative cursor-pointer" src="product.png" alt=""/>
              </>)}
            </div>
        </div>

     </section>
    </>
  );
}
