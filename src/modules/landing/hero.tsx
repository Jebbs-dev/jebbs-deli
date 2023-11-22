import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaClock } from "react-icons/fa6";

export const HeroSection = () => {
  return (
    <div className=" w-full" id="home">
      <div className="grid int:h-[100vh] md:h-[80vh] max-w-[90vw] mx-auto">
        <div className="grid md:auto-cols-fr gap-5 items-center md:grid-cols-2">
          <div className="flex flex-col py-5">
            <h1 className="font-bold text-4xl md:text-5xl leading-10 md:leading-[65px] text-hair font-sans py-3">
              Discover a World of Flavors at Your Fingertips
            </h1>
            <p className="text-1xl md:text-2xl opacity-40">
              Convenience, variety, and delight. Satisfy Your cravings with
              seamless food ordering.
            </p>
            <div className="flex flex-row justify-around md:justify-start space-x-5 my-5 py-3 ">
              <div className="w-1/2 md:w-auto">
                <Link href="#contact">
                  <button
                    type="button"
                    className="rounded-md w-full px-4 py-2 text-white border-solid border-[1px] bg-orange-400 border-orange-400 hover:bg-orange-500 hover:border-orange-500"
                  >
                    Reserve a table
                  </button>
                </Link>
              </div>
              <div className="w-1/2 md:w-auto">
                <Link href="#services">
                  <button
                    type="button"
                    className="rounded-md w-full  px-4 py-2 border-solid border-[1px] text-hair border-orange-400 mr-3 hover:bg-orange-500 hover:text-white hover:border-orange-500"
                  >
                    Direct order
                  </button>
                </Link>
              </div>
            </div>
            <div className="p-6 md:max-w-[280px] bg-white bg-opacity-70 rounded-xl shadow-md flex md:items-center space-x-4 md:mx-0 w-full">
              <div className="shrink-0">
                <FaClock style={{ color: "#f2994a" }} />
              </div>
              <div>
                <p className="text-black">Open: 9:00am-11:00pm</p>
              </div>
            </div>
          </div>
          <div className="">
            <img src="/images/HeroImage.png" alt="Woman eating fruits" />
          </div>
        </div>
      </div>
    </div>
  );
};

// export const HeroSection;
