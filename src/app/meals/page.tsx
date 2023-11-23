"use client";

import React, { SetStateAction, useContext, useState } from "react";
import { MealItem } from "@/modules/landing/menu/meal-item";
import CartContext from "@/providers/cart/cart-context";
// import { mealTypes } from "../../../../data/dataloader";
// import Paginate from "./Paginate";

interface mealProps {
  meals: mealTypes[];
}

interface categoryPages {
  meal: number;
  snack: number;
  drink: number;
  dessert: number;
}

interface MealCategories {
  [category: string]: mealTypes[];
}

const Meals = ({ meals }: mealProps) => {
  const cartCtx = useContext(CartContext);

  const [allMeals, setAllMeals] = useState(meals);
  const [mealQuantity, setMealQuantity] = useState(1);
  const [mealCategory, setMealCategory] = useState("meal");

  const pages: categoryPages = {
    meal: 1,
    snack: 1,
    drink: 1,
    dessert: 1,
  };

  const [currentCategoryPage, setCurrentCategoryPage] =
    useState<categoryPages>(pages);

  const [mealsPerPage] = useState(8);

  const categories: MealCategories = {
    snack: allMeals.filter((meal) => meal.category === "snack"),
    drink: allMeals.filter((meal) => meal.category === "drink"),
    dessert: allMeals.filter((meal) => meal.category === "dessert"),
    meal: allMeals.filter((meal) => meal.category === "meal"), // Assuming you have a category named 'meal'
  };

  const mealsToShow = categories[mealCategory];

  const mealsPages = currentCategoryPage[mealCategory as keyof categoryPages];

  const indexOfLastMeal = mealsPages * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = mealsToShow.slice(indexOfFirstMeal, indexOfLastMeal);

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
  };

  const paginate = (category: string, pageNumber: number) => {
    setCurrentCategoryPage({
      ...currentCategoryPage,
      [category]: pageNumber,
    });
  };

  const previousPage = () => {
    if (Number(currentCategoryPage) !== 1) {
      setCurrentCategoryPage({
        ...currentCategoryPage,
        [mealCategory]:
          currentCategoryPage[mealCategory as keyof categoryPages] - 1,
      });
    }
  };

  const totalPages = Math.ceil(mealsToShow.length / mealsPerPage);
  const nextPage = () => {
    if (Number(currentCategoryPage) !== totalPages) {
      setCurrentCategoryPage({
        ...currentCategoryPage,
        [mealCategory]:
          currentCategoryPage[mealCategory as keyof categoryPages] + 1,
      });
    }
  };

  return (
    <>
      <div className="w-full bg-slate-100" id="menu">
        <div className="max-w-[90vw] mx-auto pt-20 overflow-hidden">
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
          <div className="max-w-[90vw] py-6 grid grid-cols-1 md:grid-cols-4 auto-cols-auto gap-5 justify-between ">
            {currentMeals.map((meal: mealTypes) => (
              <MealLists
                key={meal.id}
                name={meal.name}
                image={meal.image}
                price={meal.price}
                description={meal.description}
                addToCartHandler={() => addToCartHandler(meal)}
                id={""}
                category={""}
              />
            ))}
          </div>
          {/* <Paginate
            mealsPerPage={mealsPerPage}
            totalMeals={mealsToShow.length}
            paginate={paginate}
            currentCategoryPage={currentCategoryPage}
            previousPage={previousPage}
            nextPage={nextPage}
            totalPages={totalPages}
          /> */}
        </div>
      </div>
    </>
  );
};

export default Meals;
