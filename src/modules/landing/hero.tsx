"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaClock } from "react-icons/fa6";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <div className=" w-full" id="home">
      <div className="grid int:h-[100vh] md:h-[80vh] max-w-[90vw] mx-auto">
        <div className="grid md:auto-cols-fr gap-5 items-center md:grid-cols-2">
          <motion.div
            className="flex flex-col py-5"
            initial={{ opacity: 0, y: 0 }} // Start invisible and slightly below
            animate={{ opacity: 1, y: 0 }} // Fade in and move up
            transition={{ duration: 0.5, ease: "easeIn" }} // Smooth transition
          >
            <h1 className="font-bold text-4xl md:text-6xl leading-10 md:leading-[65px] text-hair font-sans py-3">
              Discover a World of Flavors at Your Fingertips
            </h1>
            <p className="text-1xl md:text-2xl opacity-40">
              Convenience, variety, and delight. Satisfy Your cravings with
              seamless food ordering.
            </p>
            <div className="flex flex-row justify-start space-x-5 my-5 py-3 ">
              <div className="w-1/2 md:w-auto">
                <Link href="/shop">
                  <button
                    type="button"
                    className="rounded-md w-full px-4 py-2 text-white border-solid border-[1px] bg-orange-400 border-orange-400 hover:bg-orange-500 hover:border-orange-500 cursor-pointer"
                  >
                    Make an order
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            className=""
            initial={{ opacity: 0, y: 0 }} // Start invisible and slightly below
            animate={{ opacity: 1, y: 0 }} // Fade in and move up
            transition={{ duration: 0.1, ease: "easeIn" }}
          >
            <Image
              src="/images/HeroImage.png"
              alt="Woman eating fruits"
              height={500}
              width={500}
              className="h-auto w-auto"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// export const HeroSection;
