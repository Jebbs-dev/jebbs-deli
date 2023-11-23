import React from "react";
import Image from "next/image";
import { widgets } from "./data/widgets";

export const CtaSection = () => {
  return (
    <div className=" w-full">
      <div className="grid int:h-[100vh] max-w-[90vw] mx-auto">
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
                <>
                  <div className="w-40 h-10 flex flex-row items-center ">
                    <span
                      className="rounded-full bg-rose-100 w-10 h-10 flex items-center justify-around"
                      style={{ backgroundColor: widget.color }}
                    >
                      <Image src={widget.image} height={24} width={24} alt="" />{" "}
                    </span>
                    <p className="ml-2 font-semibold">{widget.title}</p>
                  </div>
                </>
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
      </div>
    </div>
  );
};

