"use client"

import { useState, useEffect } from "react";

import Skeleton from "@/components/shimmer/shimmer";

import { LuCamera } from "react-icons/lu";
import { CiHeadphones } from "react-icons/ci";
import { GiSmartphone } from "react-icons/gi";
import { BsSmartwatch } from "react-icons/bs";
import { RiComputerLine } from "react-icons/ri";
import { SiYoutubegaming } from "react-icons/si";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";


export default function Categories() {

 const [activeCategory, setActiveCategory] = useState(2)
 const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        setShimmer(false);
    }, 400);

    return () => clearTimeout(timer);
    }, []);

 const handleCategory = (index) => {
    setActiveCategory(index)
 }

 const leftArrow = ()=>{
    setActiveCategory((prev)=>(prev > 0 ? prev - 1 : 0))
 }

 const rightArrow = ()=>{
    setActiveCategory((prev)=>(prev < category.length - 1 ? prev + 1 : category.length - 1))
 }

 const category = [
    {
        icon: <GiSmartphone />,
        title:"Phones",
    },
    {
        icon: <RiComputerLine />,
        title:"Computers",
    },
    {
        icon: <BsSmartwatch />,
        title:"SmartWatch",
    },
    {
        icon: <LuCamera />,
        title:"Camera",
    },
    {
        icon: <CiHeadphones />,
        title:"HeadPhones",
    },
    {
        icon: <SiYoutubegaming />,
        title:"Gaming",
    },
 ]
    
  return (
    <>
      <section className="mx-30 py-17 border-b border-[#ccc9c9]">
        
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-8 rounded-sm bg-[#DB4444]"></div>
          <p className="font-semibold text-sm text-[#DB4444]">Categories</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-semibold text-3xl">Browse by Category</p>

          <div className="flex gap-3">
            <span onClick={leftArrow} className="cursor-pointer bg-[#f1f0f0] hover:bg-[#e6e5e5] active:bg-[#d1cdcd] transition-all duration-300 w-9 h-9 rounded-full flex items-center justify-center">
              <FiArrowLeft className="text-xl" />
            </span>
            <span onClick={rightArrow} className="cursor-pointer bg-[#f1f0f0] hover:bg-[#e6e5e5] active:bg-[#d1cdcd] transition-all duration-300 w-9 h-9 rounded-full flex items-center justify-center">
              <FiArrowRight className="text-xl" />
            </span>
          </div>
        </div>

        <div className="flex justify-between mt-17 select-none">
        { shimmer ? (<>
        {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="w-40 h-40 bg-[#f8f8f8]"/>
                  ))}
        </>) : (<>
        {category.map((item, index) => (
            <div onClick={() => handleCategory(index)} key={index} className={`w-40 h-40 cursor-pointer border flex flex-col justify-center items-center gap-5 border-[#ccc9c9] ${activeCategory === index?"transition-all duration-300 bg-[#DB4444] active:bg-[#cb3f3f] text-white":"bg-white text-black"}`}>
                
            <div className="text-5xl">{item.icon}</div>
            <h1 className="text-md">{item.title}</h1>

            </div>
        ))}
        </>)}
        </div>

      </section>
    </>
  );
}