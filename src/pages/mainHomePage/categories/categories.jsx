"use client";

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
  const [activeCategory, setActiveCategory] = useState(2);
  const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShimmer(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleCategory = (index) => {
    setActiveCategory(index);
  };

  const leftArrow = () => {
    setActiveCategory((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const rightArrow = () => {
    setActiveCategory((prev) =>
      prev < category.length - 1 ? prev + 1 : category.length - 1,
    );
  };

  const category = [
    {
      icon: <GiSmartphone />,
      title: "Phones",
    },
    {
      icon: <RiComputerLine />,
      title: "Computers",
    },
    {
      icon: <BsSmartwatch />,
      title: "SmartWatch",
    },
    {
      icon: <LuCamera />,
      title: "Camera",
    },
    {
      icon: <CiHeadphones />,
      title: "HeadPhones",
    },
    {
      icon: <SiYoutubegaming />,
      title: "Gaming",
    },
  ];

  return (
    <>
      <section className="mx-4 border-b border-[#ccc9c9] dark:border-[#525252] py-12 sm:mx-6 lg:mx-30 lg:py-17 select-none">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-8 rounded-sm bg-[#DB4444]"></div>
          <p className="font-semibold text-sm text-[#DB4444]">Categories</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xl font-semibold sm:text-3xl">
            Browse by Category
          </p>

          <div className="flex gap-3">
            <span
              onClick={leftArrow}
              className="cursor-pointer dark:bg-[#2d2d2d] dark:hover:bg-[#444444] dark:active:bg-[#616161] bg-[#f1f0f0] hover:bg-[#e6e5e5] active:bg-[#d1cdcd] transition-all duration-300 w-9 h-9 rounded-full flex items-center justify-center"
            >
              <FiArrowLeft className="text-xl" />
            </span>
            <span
              onClick={rightArrow}
              className="cursor-pointer dark:bg-[#2d2d2d] dark:hover:bg-[#444444] dark:active:bg-[#616161] bg-[#f1f0f0] hover:bg-[#e6e5e5] active:bg-[#d1cdcd] transition-all duration-300 w-9 h-9 rounded-full flex items-center justify-center"
            >
              <FiArrowRight className="text-xl" />
            </span>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-around gap-4 select-none sm:mt-17 sm:justify-between">
          {shimmer ? (
            <>
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-22 w-22 sm:h-40 sm:w-40 rounded-xl" />
              ))}
            </>
          ) : (
            <>
              {category.map((item, index) => (
                <div
                  onClick={() => handleCategory(index)}
                  key={index}
                  className={`flex h-22 w-22 rounded-xl flex-col cursor-pointer items-center justify-center gap-3 dark:border-none border border-[#ccc9c9] text-center transition-all duration-300 sm:h-40 sm:w-40 sm:gap-5 ${activeCategory === index ? "bg-[#DB4444] text-white active:bg-[#cb3f3f]" : "dark:bg-[#3d3d3d] dark:text-white bg-white text-black"}`}
                >
                  <div className="text-3xl md:text-5xl">{item.icon}</div>
                  <h1 className="text-xs md:text-md">{item.title}</h1>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}
