"use client";

import React, {
  MouseEventHandler,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { MealItem } from "./meal-item";
import CartContext from "@/providers/cart/cart-context";
import Link from "next/link";

export interface mealTypes {
  addToCartHandler: MouseEventHandler<HTMLButtonElement> | undefined;
  id: string | number;
  name: string;
  image: string;
  price: number;
  category: string;
  description: string;
}

interface menuProps {
  meals: mealTypes[];
}

interface MealCategories {
  [category: string]: mealTypes[];
}

export const Menu = () => {
  const mealsArray: mealTypes[] = [];
  const [meals, setMeals] = useState<mealTypes[]>(mealsArray);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMealsHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://my-food-api.onrender.com/meals");
      if (!response.ok) {
        throw new Error("something went wrong!");
      }
      const data = await response.json();

      const loadedMeals = [];

      for (const key in data) {
        loadedMeals.push({
          id: key,
          name: data[key].name,
          image: data[key].image,
          price: data[key].price,
          category: data[key].category,
          description: data[key].description,
          addToCartHandler: undefined,
        });
      }
      setMeals(loadedMeals);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMealsHandler();
  }, [fetchMealsHandler]);

  const cartCtx = useContext(CartContext);

  const [mealQuantity, setMealQuantity] = useState(1);
  const [showMeals, setShowMeals] = useState(false);

  // const categ = 'meal' as const;

  const [mealCategory, setMealCategory] = useState("meal");

  // const snack = props.meals.filter((meal) => meal.category === "snack");
  // const drink = props.meals.filter((meal) => meal.category === "drink");
  // const dessert = props.meals.filter((meal) => meal.category === "dessert");

  const mealsToShow = meals.slice(0, 8);

  const categories: MealCategories = {
    snack: meals.filter((meal: mealTypes) => meal.category === "snack"),
    drink: meals.filter((meal: mealTypes) => meal.category === "drink"),
    dessert: meals.filter((meal: mealTypes) => meal.category === "dessert"),
    meal: mealsToShow, // Assuming you have a category named 'meal'
  };

  const toggleCategory = (category: SetStateAction<string>) => {
    setMealCategory(category);
  };

  const addToCartHandler = (meal: mealTypes) => {
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

  const toggleMeals = () => {
    setShowMeals(true);
  };

  return (
    <>
      <div className="w-full bg-orange-50" id="menu">
        <div className="max-w-[90vw] mx-auto pt-20 pb-60 overflow-hidden">
          <div className="flex flex-col justify-between">
            <h2 className="text-4xl font-bold mb-5 ">Full Menu</h2>
            <div className="flex flex-row  md:flex-row ">
              <div className="flex rounded-md items-center py-1 md:py-2 px-2 md:px-3 justify-around border active:border-orange-400 bg-orange-400 text-white mr-2">
                <a
                  href="/"
                  className="align-middle"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCategory("meal");
                  }}
                >
                  Meals
                </a>
              </div>
              <div className="flex rounded-md items-center py-1 md:py-2 px-2 md:px-3 justify-around text-hair mr-2 border border-hair ">
                <a
                  href="/"
                  className="align-middle"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCategory("snack");
                  }}
                >
                  Snacks
                </a>
              </div>
              <div className="flex rounded-md items-center py-1 md:py-2 px-2 md:px-3 justify-around text-hair mr-2 border border-hair">
                <a
                  href="/"
                  className="align-middle"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCategory("drink");
                  }}
                >
                  Drinks
                </a>
              </div>
              <div className="flex rounded-md items-center py-1 md:py-2 px-2 md:px-3 justify-around text-hair mr-2 border border-hair">
                <a
                  href="/"
                  className="align-middle"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCategory("dessert");
                  }}
                >
                  Desserts
                </a>
              </div>
              {/* Used flex, items-center and justify arounf to center the icon inside the div circle */}
            </div>
          </div>
          {isLoading && (
            <p className="text-4xl text-center mx-auto my-32">
              Loading meals...
            </p>
          )}
          {error && (
            <p className="text-4xl text-center mx-auto my-32">{error}</p>
          )}
          {meals && (
            <div className="max-w-[90vw] py-6 grid grid-cols-1 md:grid-cols-4 auto-cols-auto gap-5 justify-between ">
              {categories[mealCategory].map((meal: mealTypes) => (
                <MealItem
                  key={meal.id}
                  name={meal.name}
                  image={meal.image}
                  price={meal.price}
                  description={meal.description}
                  addToCartHandler={() => addToCartHandler(meal)}
                  id={meal.id}
                  category={meal.category}
                />
              ))}
            </div>
          )}
          <div className="my-3 py-3 text-center items-center">
            <button
              type="button"
              className="rounded-md px-4 py-2 border-solid border-[1px] text-white border-orange-400 bg-orange-400 mr-3 hover:bg-orange-500 hover:text-white hover:border-orange-500"
              onClick={toggleMeals}
            >
              <Link href="/meals">Explore more</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
