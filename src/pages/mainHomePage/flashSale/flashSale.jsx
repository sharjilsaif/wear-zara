"use client";

import { useState, useEffect, useRef } from "react";

import Skeleton from "@/components/shimmer/shimmer";

import { IoEyeOutline } from "react-icons/io5";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { FaStar, FaRegHeart, FaHeart } from "react-icons/fa6";

export default function FlashSale() {
  const sliderRef = useRef(null);
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [shimmer, setShimmer] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const [redHeart, setRedHeart] = useState(null);
  const [addedCart, setAddedCart] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShimmer(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const startCountdown = () => {
    const randomSeconds = Math.floor(Math.random() * 60);

    const targetDate = new Date(
      Date.now() +
        3 * 24 * 60 * 60 * 1000 +
        19 * 60 * 60 * 1000 +
        randomSeconds * 1000 +
        randomSeconds * 1000,
    );

    const interval = setInterval(() => {
      const now = new Date();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(interval);
        return;
      }

      setDays(
        String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, "0"),
      );
      setHours(
        String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
      );
      setMinutes(
        String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, "0"),
      );
      setSeconds(String(Math.floor((distance / 1000) % 60)).padStart(2, "0"));
    }, 1000);

    return interval;
  };

  useEffect(() => {
    const interval = startCountdown();

    return () => clearInterval(interval);
  }, []);

  const handleRedHeart = (id) => {
    setRedHeart(redHeart === id ? null : id);
  };

  const handleCard = (index) => {
    setAddedCart(index);
  };

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  const sale = [
    {
      off: "40",
      imgURL: "gamepad.png",
      title: "HAVIT HV-G92 GAMEPAD",
      priceWas: "160",
      priceNow: "120",
      rating: "88",
    },
    {
      off: "35",
      imgURL: "keyboard.png",
      title: "AK-900 WIRED KEYBOARD",
      priceWas: "1160",
      priceNow: "960",
      rating: "75",
    },
    {
      off: "30",
      imgURL: "monitor.png",
      title: "IPS LCS GAMING MONITOR",
      priceWas: "400",
      priceNow: "370",
      rating: "99",
    },
    {
      off: "25",
      imgURL: "chair.png",
      title: "S-SERIES COMFORT CHAIR",
      priceWas: "400",
      priceNow: "375",
      rating: "76",
    },
    {
      off: "45",
      imgURL: "mouse.png",
      title: "BRANDED DELL MOUSE",
      priceWas: "100",
      priceNow: "55",
      rating: "40",
    },
    {
      off: "25",
      imgURL: "chair.png",
      title: "S-SERIES COMFORT CHAIR",
      priceWas: "400",
      priceNow: "375",
      rating: "76",
    },
    {
      off: "55",
      imgURL: "headphone.png",
      title: "RONIN LATEST MODEL HEADPHOE",
      priceWas: "210",
      priceNow: "175",
      rating: "96",
    },
    {
      off: "25",
      imgURL: "laptop-bag.png",
      title: "S-SERIES COMFORT CHAIR",
      priceWas: "400",
      priceNow: "375",
      rating: "76",
    },
    {
      off: "15",
      imgURL: "earbuds.png",
      title: "SAMSUNG LATEST EARBUDS",
      priceWas: "250",
      priceNow: "145",
      rating: "97",
    },

    {
      off: "30",
      imgURL: "camera.png",
      title: "SONY UPGRADED CAMERA",
      priceWas: "1200",
      priceNow: "920",
      rating: "67",
    },
  ];

  return (
    <>
      <section className="ml-4 border-b border-[#ccc9c9] pb-15 pl-0 pr-4 sm:ml-6 sm:pr-6 lg:ml-30 lg:pl-20 lg:pr-20">
        <div className="flex items-center gap-2 mb-4 ">
          <div className="w-4 h-8 rounded-sm bg-[#DB4444]"></div>
          <p className="font-semibold text-sm text-[#DB4444]">Today's</p>
        </div>

        <div className="flex flex-col gap-4 pr-0 sm:flex-row sm:items-center sm:justify-between sm:pr-4 lg:pr-15">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 lg:gap-20">
            <p className="text-2xl font-semibold sm:text-3xl">Flash Sales</p>

            <div className="bg-white select-none">
              <div className="flex items-end justify-center">
                <div className="flex flex-col items-center w-14">
                  <span className="text-xs font-medium text-gray-900 mb-1 tracking-wide">
                    Days
                  </span>
                  {shimmer ? (
                    <Skeleton className="w-[70%] h-8 mt-1 bg-[#e4e4e4] rounded-sm" />
                  ) : (
                    <span className="text-3xl font-semibold text-black tracking-tight">
                      {days}
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-end h-12 pb-1.5 px-1">
                  <span className="text-xl font-bold text-red-400">:</span>
                </div>

                <div className="flex flex-col items-center w-14">
                  <span className="text-xs font-medium text-gray-900 mb-1 tracking-wide">
                    Hours
                  </span>
                  {shimmer ? (
                    <Skeleton className="w-[70%] h-8 mt-1 bg-[#e4e4e4] rounded-sm" />
                  ) : (
                    <span className="text-3xl font-semibold text-black tracking-tight">
                      {hours}
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-end h-12 pb-1.5 px-1">
                  <span className="text-xl font-bold text-red-400">:</span>
                </div>

                <div className="flex flex-col items-center w-14">
                  <span className="text-xs font-medium text-gray-900 mb-1 tracking-wide">
                    Minutes
                  </span>
                  {shimmer ? (
                    <Skeleton className="w-[70%] h-8 mt-1 bg-[#e4e4e4] rounded-sm" />
                  ) : (
                    <span className="text-3xl font-semibold text-black tracking-tight">
                      {minutes}
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-end h-12 pb-1.5 px-1">
                  <span className="text-xl font-bold text-red-400">:</span>
                </div>

                <div className="flex flex-col items-center w-14">
                  <span className="text-xs font-medium text-gray-900 mb-1 tracking-wide">
                    Seconds
                  </span>
                  {shimmer ? (
                    <Skeleton className="w-[70%] h-8 mt-1 bg-[#e4e4e4] rounded-sm" />
                  ) : (
                    <span className="text-3xl font-semibold text-black tracking-tight">
                      {seconds}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!viewAll && (
            <div className="flex gap-3">
              <span
                onClick={scrollLeft}
                className="cursor-pointer bg-[#f1f0f0] hover:bg-[#e6e5e5] active:bg-[#d1cdcd] transition-all duration-300 w-9 h-9 rounded-full flex items-center justify-center"
              >
                <FiArrowLeft className="text-xl" />
              </span>
              <span
                onClick={scrollRight}
                className="cursor-pointer bg-[#f1f0f0] hover:bg-[#e6e5e5] active:bg-[#d1cdcd] transition-all duration-300 w-9 h-9 rounded-full flex items-center justify-center"
              >
                <FiArrowRight className="text-xl" />
              </span>
            </div>
          )}
        </div>

        {shimmer ? (
          <>
            <div className="flex mt-10 mb-16 pb-2 pr-2 gap-9 overflow-x-auto">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="h-70 min-w-55">
                  <Skeleton className="h-[73%] w-full rounded-2xl bg-[#e4e4e4]" />
                  <Skeleton className="mt-2 h-[5%] w-[70%] rounded-full bg-[#e4e4e4]" />
                  <Skeleton className="mt-3 h-[5%] w-[30%] rounded-full bg-[#e4e4e4]" />
                  <Skeleton className="mt-2 h-[5%] w-[50%] rounded-full bg-[#e4e4e4]" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div
              ref={sliderRef}
              className={`mt-10 mb-7 select-none flex ${viewAll ? "flex-wrap justify-start gap-4 sm:gap-6 lg:gap-10" : "gap-4 overflow-x-auto pb-2 pr-2 sm:gap-6 lg:gap-8"}`}
            >
              {sale.map((item, index) => (
                <div
                  key={index}
                  className={`h-80 shrink-0 ${viewAll ? "mb-7 w-full min-w-[220px] sm:w-[calc(50%-0.75rem)] lg:w-[220px]" : "min-w-[220px] sm:min-w-[230px] lg:min-w-[220px]"}`}
                >
                  <div className="group relative h-56 w-full overflow-hidden rounded-2xl border border-[#f0f0f0] bg-[#f7f7f7] p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <img
                        className="h-auto max-h-[75%] w-auto max-w-[80%] object-contain transition-all duration-300 group-hover:scale-105"
                        src={item.imgURL}
                        alt=""
                      />
                    </div>

                    <div className="absolute flex w-full justify-between pt-2 px-2">
                      <span className="flex h-5 w-10 items-center justify-center rounded-full bg-[#DB4444] text-[10px] font-semibold text-white">
                        -{item.off}%
                      </span>
                      <div className="flex flex-col gap-2">
                        <div
                          onClick={() => handleRedHeart(index)}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#fff5f5] active:bg-[#ebebeb]"
                        >
                          {redHeart === index ? (
                            <FaHeart className="text-md text-[#DB4444]" />
                          ) : (
                            <FaRegHeart className="text-md" />
                          )}
                        </div>
                        <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#f7f7f7] active:bg-[#ebebeb]">
                          <IoEyeOutline className="text-md" />
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => handleCard(index)}
                      className="absolute bottom-0 w-full bg-[#111111] py-2.5 text-center text-sm text-white opacity-0 translate-y-2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 active:text-[#e3e3e3]"
                    >
                      {addedCart === index ? "Added to Card" : "Add to Cart"}
                    </div>
                  </div>

                  <div className="mt-4 flex h-20 flex-col justify-around">
                    <h1 className="text-sm font-semibold text-[#111111]">
                      {item.title}
                    </h1>
                    <div className="flex gap-2">
                      <p className="text-sm font-semibold text-[#DB4444]">
                        ${item.priceNow}
                      </p>
                      <p className="text-sm text-[#676666] line-through">
                        ${item.priceWas}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className="text-xs text-yellow-500"
                          />
                        ))}
                      </div>
                      <p className="text-[#676666] text-xs">({item.rating})</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="w-full flex justify-center select-none">
          <button
            onClick={() => setViewAll(!viewAll)}
            className="bg-[#DB4444] hover:bg-[#d14444] active:bg-[#bb3d3d] transition-all duration-300 cursor-pointer px-7 py-3 text-sm text-white rounded-md"
          >
            {viewAll ? "View less Products" : "View All Products"}
          </button>
        </div>
      </section>
    </>
  );
}
