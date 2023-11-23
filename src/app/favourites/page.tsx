"use client";

import React, { useContext, useState } from "react";
import FaveContext, { FaveItem } from "@/providers/favourites/favourites-context";
import CartContext from "@/providers/cart/cart-context";
import {FaveItems} from "@/modules/favourites/favourite-item";
import { StaticImageData } from "next/image";

const Favourites = () => {
  const cartCtx = useContext(CartContext);
  const faveCtx = useContext(FaveContext);

  console.log(faveCtx.items)

  const isEmpty = faveCtx.items.length === 0;

  const [mealQuantity, setMealQuantity] = useState(1);

  const addToCartHandler = (meal: FaveItem) => {
    cartCtx.addItem({
      id: meal.id,
      name: meal.name,
      category: meal.category,
      quantity: mealQuantity,
      price: meal.price,
      image: meal.image,
      onRemove: undefined,
      onAdd: undefined,
    });
  };

  

  return (
    <>
      {/* <Navbar/> */}
      <div className={`w-full ${isEmpty ? 'h-[100vh]' : ""}  bg-orange-100`} id="fave">
        <div className="max-w-[90vw] mx-auto pt-20 overflow-hidden">
          <div className="flex flex-col justify-between">
            <h2 className="text-4xl font-bold mb-5 ">Favourites</h2>
          </div>
          <div className="max-w-[90vw] py-6 grid grid-cols-1 md:grid-cols-4 auto-cols-auto gap-5 justify-between ">
            {faveCtx.items.map((item: FaveItem ) => (
              <FaveItems
                key={item.id}
                name={item.name}
                image={item.image}
                price={item.price}
                description={item.description}
                addToCartHandler={() => addToCartHandler(item)} id={item.id} category={item.category}              />
            ))}
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </>
  );
};

export default Favourites;
