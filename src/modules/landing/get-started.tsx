import React from "react";
import { motion } from "framer-motion";

const carouselItems = [
  {
    id: 1,
    title: "Discover Your Flavors",
    image: "",
  },
  {
    id: 2,
    title: "Enjoy Quality",
    image: "",
  },
  {
    id: 3,
    title: "Satisfaction Guaranteed",
    image: "",
  },
];

const GetStarted = () => {
  return (
    <div className="w-full bg-orange-50 pt-20 pb-20">
      <div className="h-[600px] md:h-[800px] w-[90vw] mx-auto bg-green-800 rounded-lg relative -top-60 p-20">
      <motion.svg
          width="60"
          height="60"
          viewBox="0 0 40 40"
          initial={{ backgroundColor: "white" }}
          animate={{ backgroundColor: "transparent" }}
          exit={{ backgroundColor: "white" }}
        >
          {/* Background Circle */}
          <motion.circle
            cx="20"
            cy="20"
            r="18"
            fill="white"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 1 }}
          />

          {/* Animated Border (Progress Circle) */}
          <motion.circle
            cx="20"
            cy="20"
            r="18"
            fill="black"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="113"
            strokeDashoffset="-113"
            transform="rotate(-90 20 20)" // Rotates to start from the top
            initial={{ fill: "white" }}
            animate={{ strokeDashoffset: 0, fill: "transparent" }} // Animates to 0 for full progress
            exit={{ opacity: 1 }}
            transition={{ duration: 3, ease: "linear", delay: 1 }}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="bold"
            fill="black"
          >
            01
          </text>
        </motion.svg>
      </div>

      <div className="w-[90vw] mx-auto flex flex-col md:flex-row md:justify-between relative -top-40 gap-5 md:gap-20">
        <h2 className="text-4xl md:text-6xl font-bold md:w-1/2">Deli has you covered.</h2>
        <p className="text-xl md:text-2xl md:w-1/2">
          Hungry? Too tired to cook? Have friends over, or do you simply need to
          chop life? Visit Deli, and let’s deliver happiness to your
          doorstep in minutes.
        </p>
      </div>
    </div>
  );
};

export default GetStarted;
