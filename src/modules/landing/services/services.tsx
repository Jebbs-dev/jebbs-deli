"use client";

import React, { useContext, useState } from "react";
import CartContext from "@/providers/cart/cart-context";
import FaveContext from "@/providers/favourites/favourites-context";
import { IMeals, Meals } from "@/modules/landing/services/data/meals";
import { FaAngleLeft, FaAngleRight, FaHeart } from "react-icons/fa6";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Services = () => {
  const slideLeft = () => {
    const slider = document.getElementById("slider");
    if (slider) {
      slider.scrollLeft = slider.scrollLeft - 320;
    }
  };

  const slideRight = () => {
    const slider = document.getElementById("slider");
    if (slider) {
      slider.scrollLeft = slider.scrollLeft + 320;
    }
  };

  const cartCtx = useContext(CartContext);
  const faveCtx = useContext(FaveContext);

  const [mealQuantity, setMealQuantity] = useState(1);

  const [tabValue, setTabValue] = useState("customers");

  const addToCartHandler = (meal: IMeals) => {
    cartCtx.addItem({
      id: meal.id,
      name: meal.name,
      quantity: mealQuantity,
      category: meal.category,
      price: meal.price,
      image: meal.image,
    });

    console.log(cartCtx.items);
  };

  const addToFaveHandler = (meal: IMeals) => {
    faveCtx.addItem({
      id: meal.id,
      name: meal.name,
      category: meal.category,
      price: meal.price,
      description: meal.description,
      image: meal.image,
      addToCartHandler: undefined,
    });
  };

  return (
    <div className="w-full bg-orange-50" id="services">
      <div className="max-w-[90vw] mx-auto py-10 md:p-20">
        <div className="">
          <Tabs defaultValue="customers">
            <TabsList className="grid grid-cols-2 w-64 mx-auto rounded-full transition bg-orange-200 h-12">
              <TabsTrigger
                value="customers"
                onClick={() => setTabValue("customers")}
                className="rounded-full data-[state=active]:bg-orange-400 data-[state=active]:text-white data-[state=active]:transition py-2.5 relative"
              >
                Customers
              </TabsTrigger>
              <TabsTrigger
                value="vendors"
                onClick={() => setTabValue("vendors")}
                className="rounded-full data-[state=active]:bg-orange-400 data-[state=active]:text-white  data-[state=active]:transition py-2.5 relative"
              >
                Vendors
              </TabsTrigger>
            </TabsList>
            <TabsContent value="customers">
              <div className="flex flex-col justify-center items-center mt-10 w-[80vw] md:w-[50vw] mx-auto gap-3">
                <h2 className="text-3xl md:text-5xl font-bold text-center">
                  Order Your Favourite Dishes
                </h2>
                <p className="w-[80vw] md:w-[40vw] mx-auto text-center">
                  Have meals delivered to you within minutes from a wide variety
                  of restaurants ranging from African to Continental cuisines to
                  satisfy your cravings.
                </p>

                <Image
                  src="/images/phone-food-2.png"
                  width={400}
                  height={400}
                  alt="Food on phone"
                  className="w-[300px] h-[600px]"
                />
              </div>
            </TabsContent>
            <TabsContent value="vendors">
              <div className="flex flex-col justify-center items-center mt-10 w-[80vw] md:w-[50vw] mx-auto gap-3">
                <h2 className="text-3xl md:text-5xl font-bold text-center">
                  Connect with Customers
                </h2>
                <p className="w-[80vw] md:w-[40vw] mx-auto text-center">
                  Unlock new levels of growth with seamless menu and orders
                  management, multiple branches and team, easy payouts
                  withdrawal and a lot more.
                </p>

                <Image
                  src="/images/phone-food-2.png"
                  width={400}
                  height={400}
                  alt="Food on phone"
                  className="w-[300px] h-[600px]"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/* <div className="flex flex-row justify-between">
          <h2 className="text-3xl md:text-4xl font-bold">
            Order Your Favourite Dishes
          </h2>
          <div className="flex flex-row">
            <button
              className="flex rounded-full h-10 w-10 items-center justify-around bg-white text-orange-400 mr-2"
              onClick={slideLeft}
            >
              <FaAngleLeft className="align-middle" />
            </button>
            <button
              className="flex rounded-full h-10 w-10 items-center justify-around bg-orange-400 text-white"
              onClick={slideRight}
            >
              <FaAngleRight />
            </button> */}
        {/* Used flex, items-center and justify around to center the icon inside the div circle */}
        {/* </div>
        </div> */}
        {/* grid grid-cols-1 int:grid-cols-4 md:grid-cols-2 auto-cols-auto gap-5 md:justify-between */}
        {/* <div className="py-6 relative flex">
          <div
            id="slider"
            className="w-full py-6 gap-4 auto-rows-fr overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide space-x-4"
          >
            {Meals.map((meal) => (
              <div
                className="w-full int:w-1/4 md:max-w-[310px] h-full p-4 items-center text-center bg-white bg-opacity-70 rounded-[3%] hover:rounded-[3%] hover:shadow-xl hover:scale-105 box-border hover:ease-in-out duration-300 inline-block"
                key={meal.id}
              >
                <button
                  // id="favourite"
                  onClick={() => addToFaveHandler(meal)}
                  className="flex rounded-full h-10 w-10 items-center justify-around bg-orange-200 text-white hover:bg-orange-400 active:bg-orange-400 mb-1"
                >
                  <FaHeart
                    className="w-5 h-5 text-left"
                    style={{ color: "#FFF" }}
                  />{" "}
                </button>
                <div className=" flex flex-col justify-between space-y-1">
                  <Image
                    width={150}
                    height={150}
                    src={meal.image}
                    alt=""
                    className="mx-auto mb-2"
                  />
                  <h3 className="text-[20px] font-semibold">{meal.name}</h3>
                  <p className="text-orange-400 font-semibold">
                    ${meal.price.toFixed(2)}
                  </p>
                  <p>{meal.description}</p>

                  <button
                    type="button"
                    className="rounded-sm border font-medium border-orange-400 py-1 px-3 text-orange-400 hover:bg-orange-400 hover:border-orange-400 hover:text-white"
                    onClick={() => addToCartHandler(meal)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};
