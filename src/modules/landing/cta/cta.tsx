"use client";

import React from "react";
import Image from "next/image";
import { widgets } from "./data/widgets";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export const CtaSection = () => {
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const cardVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="w-full">
      <motion.div 
        className="max-w-[90vw] flex flex-col items-center justify-center mx-auto mt-10 md:mt-20 mb-60"
        style={{ y, opacity }}
      >
        <motion.h2 
          className="text-3xl md:text-5xl text-orange-400/50 font-normal flex flex-row md:items-center mb-5 w-full justify-between md:w-auto md:justify-normal"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <span>Join Our Revolution</span>
          <p>
            {/* <Image
              src="/svgs/arrow-down-orange.svg"
              width={60}
              height={60}
              alt="Down Arrow"
              className="opacity-50"
            /> */}
            <ArrowDown size={60} className="w-10 h-10 md:w-20 md:h-20" />
          </p>
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-10 w-full">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={cardVariants}
              className="md:w-1/3"
            >
              <Card className={`border-2 ${
                index === 0 ? "border-orange-400" : 
                index === 1 ? "border-green-600" : 
                "border-rose-400"
              }`}>
                <CardHeader>
                  <CardTitle>
                    <p>Make orders</p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="mb-7">
                      Are you a customer looking for awesome delicacies? Get food
                      from your desired restaurants when you join our network.
                    </p>
                    <Link
                      href="/customers"
                      className="tracking-widest font-semibold hover:underline"
                    >
                      <span className="flex flex-row items-center">
                        SEE MORE
                        <span className="ml-2">
                          <ArrowRight size={18} />
                        </span>
                      </span>
                    </Link>
                  </div>
                </CardContent>
                <CardFooter className="p-0 w-full">
                  <Image
                    src={`/images/slide-${index === 0 ? 'one-1' : index === 1 ? 'two' : 'three'}.png`}
                    alt="food system"
                    width={200}
                    height={200}
                    className="w-full h-[230px] rounded-md"
                  />
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
      {/* <div className="grid int:h-[100vh] max-w-[90vw] mx-auto">
        <div className="grid md:auto-cols-fr gap-5 items-center md:grid-cols-2">
          <div className="">
            <img src="/images/HeroImage.png" alt="Woman eating fruits" />
          </div>
          <div className="flex flex-col p-5">
            <h1 className="font-bold text-4xl md:text-5xl leading-10 md:leading-[65px] text-hair font-sans py-3">
              We provide the best service for our customers.
            </h1>
            <p className="text-1xl md:text-2xl opacity-40">
              Explore a World of Culinary Delights at Your Fingertips - Order
              Now for a Gastronomic Journey!.
            </p>
            <div className="max-w-[23vw] grid grid-cols-1 int:grid-cols-2 gap-4 grid-flow-row my-5 py-2">
              {widgets.map((widget) => (
                <div
                  className="w-40 h-10 flex flex-row items-center"
                  key={widget.title}
                >
                  <span
                    className="rounded-full bg-rose-100 w-10 h-10 flex items-center justify-around"
                    style={{ backgroundColor: widget.color }}
                  >
                    <Image src={widget.image} height={24} width={24} alt="" />{" "}
                  </span>
                  <p className="ml-2 font-semibold">{widget.title}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-row my-3 py-3 md:w-auto">
              <button
                type="button"
                className="rounded-md px-4 py-2 w-full md:w-auto  border-solid border-[1px] text-white border-orange-400 bg-orange-400 hover:bg-orange-500 hover:text-white hover:border-orange-500"
              >
                Explore more
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};
