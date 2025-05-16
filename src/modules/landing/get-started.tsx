import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaUserPlus, FaUtensils, FaHeadset, FaBell } from "react-icons/fa";
import Image from "next/image";
import Pizzo from "../../../public/images/carousel-items/pizzo.png"
import Meal from "../../../public/images/carousel-items/meal.png"
import Order from "../../../public/images/carousel-items/order.png"
import Satisfaction from "../../../public/images/carousel-items/satisfaction.png"
import Started from "../../../public/images/carousel-items/started.png"

const carouselItems = [
  {
    id: 1,
    title: "Get Started...",
    image: Pizzo,
    color: "#FF8A65",
  },
  {
    id: 2,
    title: "Visit the App",
    image: Started,
    color: "#BA68C8",
  },
  {
    id: 3,
    title: "Make your Order",
    image: Order,
    color: "#4DB6AC",
  },
  {
    id: 4,
    title: "Enjoy your Meal",
    image: Meal,
    color: "#FFD54F",
  },
  {
    id: 5,
    title: "Satisfaction Guaranteed",
    image: Satisfaction,
    color: "#90CAF9",
  },
];

const GetStarted = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Function to lighten a hex color
  const lightenColor = (hex: string) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, (num >> 16) + 40);
    const g = Math.min(255, ((num >> 8) & 0x00ff) + 40);
    const b = Math.min(255, (num & 0x0000ff) + 40);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  return (
    <div className="w-full bg-orange-50 pt-20 pb-40">
      <div
        className="h-[600px] md:h-[800px] w-[90vw] mx-auto rounded-lg relative -top-60 p-10 md:p-20 flex flex-col items-center justify-between transition-colors duration-500"
        style={{ backgroundColor: carouselItems[activeIndex].color }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center w-full"
          >
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 px-4">
              {carouselItems[activeIndex].title}
            </h3>
            {carouselItems[activeIndex].image && (
              <div className="w-[280px] h-[280px] md:w-[400px] md:h-[400px] mx-auto relative">
                <motion.div
                  initial={{ 
                    scale: 0.8,
                    opacity: 0
                  }}
                  animate={{ 
                    scale: 1,
                    opacity: 1
                  }}
                  exit={{ 
                    scale: 0.8,
                    opacity: 0
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    duration: 0.5
                  }}
                  className="w-full h-full"
                >
                  <Image
                    src={carouselItems[activeIndex].image}
                    alt={carouselItems[activeIndex].title}
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-row items-center justify-center gap-4 md:gap-8 mb-5 md:mb-10">
          {carouselItems.map((item, idx) => (
            <motion.svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              key={idx}
              className="relative md:w-[60px] md:h-[60px] cursor-pointer"
              onClick={() => setActiveIndex(idx)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Background Circle */}
              <motion.circle
                cx="20"
                cy="20"
                r="18"
                fill={
                  idx === activeIndex
                    ? "transparent"
                    : lightenColor(carouselItems[activeIndex].color)
                }
                initial={{ opacity: 1 }}
                animate={{ opacity: idx === activeIndex ? 0 : 1 }}
              />

              {/* Animated Border (Progress Circle) */}
              <motion.circle
                key={`circle-${idx}-${activeIndex}`}
                cx="20"
                cy="20"
                r="18"
                fill="transparent"
                stroke={
                  idx === activeIndex ? lightenColor(item.color) : "transparent"
                }
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="113"
                strokeDashoffset="113"
                transform="rotate(-90 20 20)"
                initial={{
                  strokeDashoffset: "113",
                }}
                animate={{
                  strokeDashoffset: idx === activeIndex ? "0" : "113",
                }}
                transition={{
                  duration: 4,
                  ease: "linear",
                  repeat: idx === activeIndex ? 0 : 0,
                  repeatType: "loop",
                }}
              />

              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="bold"
                fill={
                  idx === activeIndex
                    ? lightenColor(item.color)
                    : carouselItems[activeIndex].color
                }
                className="md:text-base"
              >
                {idx + 1}
              </text>
            </motion.svg>
          ))}
        </div>
      </div>

      <div className="w-[90vw] mx-auto flex flex-col md:flex-row md:justify-between relative -top-40 gap-5 md:gap-20">
        <h2 className="text-3xl md:text-6xl font-bold md:w-1/2">
          Deli has you covered.
        </h2>
        <p className="text-lg md:text-2xl md:w-1/2">
          Hungry? Too tired to cook? Have friends over, or do you simply need to
          chop life? Visit Deli, and let&apos;s deliver happiness to your doorstep in
          minutes.
        </p>
      </div>

      <div className="mx-auto relative -top-20 flex flex-col gap-10">
        <motion.div
          className="flex gap-10 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 40,
            ease: "linear",
          }}
        >
          {[...Array(10)].map((_, i) => (
            <div className="flex flex-row gap-10" key={i}>
              {[
                "Quick and easy onboarding",
                "Quality meal choices",
                "Live update on orders",
                "20/7 support for customers and vendors",
              ].map((text, idx) => (
                <span
                  key={idx}
                  className="flex flex-row items-center px-4 py-2 border border-orange-200 rounded-md bg-orange-100/30"
                >
                  <span className="mr-2">
                    {idx === 0 && <FaUserPlus className="text-green-800" />}
                    {idx === 1 && <FaUtensils className="text-green-800" />}
                    {idx === 2 && <FaBell className="text-green-800" />}
                    {idx === 3 && <FaHeadset className="text-green-800" />}
                  </span>
                  {text}
                </span>
              ))}
            </div>
          ))}
        </motion.div>

        <motion.div
          className="flex gap-8 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 80, // slower
            ease: "linear",
          }}
        >
          {[...Array(10)].map((_, i) => (
            <div className="py-5 flex flex-row gap-8" key={i}>
              {[
                "/images/order-process/accepted.png",
                "/images/order-process/arrived.png",
                "/images/order-process/accepted.png",
                "/images/order-process/arrived.png",
              ].map((src, idx) => (
                <Image
                  key={idx}
                  src={src}
                  alt="process"
                  width={600}
                  height={600}
                  className={`w-[350px] h-[670px] ${
                    idx % 2 === 1 ? "mt-5" : ""
                  }`}
                />
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default GetStarted;
