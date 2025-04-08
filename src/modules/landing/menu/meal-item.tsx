import React from "react";
import { mealTypes } from "./menu";
import Image from "next/image";

export const MealItem = (props: mealTypes) => {

  return (
    <>
      <div
        className="w-full flex flex-col justify-between h-[350px] p-5 items-center text-center bg-white bg-opacity-70 rounded-[3%] hover:shadow-xl box-border hover:ease-in-out"
        key={props.id}
      >
        <Image
          src={`/props.image`} width={40} height={40}
          alt={props.name}
          className="w-[150px] h-[150px] mx-auto mb-2"
        />
        <h3 className="text-[20px] font-semibold">{props.name}</h3>
        <p className="text-orange-400 font-semibold">
          ${props.price}
        </p>
        <span>
          <p>{props.description}</p>
        </span>
        <button
          type="button"
          className="rounded-sm border font-medium border-orange-400 py-1 px-3 text-orange-400 hover:bg-orange-400 hover:border-orange-400 hover:text-white"
          onClick={props.addToCartHandler}
        >
          Add to cart
        </button>
      </div>
    </>
  );
};


