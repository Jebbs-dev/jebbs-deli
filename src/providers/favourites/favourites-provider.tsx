"use client";

import React, { useReducer } from "react";
import FaveContext, { FaveItem } from "./favourites-context";

//  type FaveItem = {
//   id: string | number;
//   name: string;
//   category: string;
//   price: number;
//   description: string;
//   image: string;
// }

type FaveState = {
  favouriteItems: FaveItem[];
};

type AppAction =
  | { type: "ADD"; item: FaveItem }
  | { type: "REMOVE"; id: string | number }

const defaultFavouriteState = {
  favouriteItems: [],
};

const favouriteReducer = (state: FaveState = defaultFavouriteState, action: AppAction) => {
  if (action.type === "ADD") {
    // Check if the item is already in the favourites
    const existingItemIndex = state.favouriteItems.findIndex(item => item.id === action.item.id);
    const existingItem = state.favouriteItems[existingItemIndex];

    let updatedFavouriteItems;

    if (existingItem) {
      // If it exists, you could update it or simply ignore the add action
      // Copy the existing array without adding the new item
      updatedFavouriteItems = [...state.favouriteItems];
    } else {
      // Item is not in the favourites, so add it
      updatedFavouriteItems = [...state.favouriteItems, action.item];
    }

    return {
      ...state,
      favouriteItems: updatedFavouriteItems,
    };
  }

  if (action.type === "REMOVE") {
    return {
      ...state,
      favouriteItems: state.favouriteItems.filter(
        (item) => item.id !== action.id
      ),
    };
  }

  // It's a good practice to return the current state by default
  return state;
};

type childrenProps = {
  children: React.ReactNode;
};

const FaveProvider = ({children}: childrenProps) => {
  const [favouriteState, dispatchFavouriteAction] = useReducer(
    favouriteReducer,
    defaultFavouriteState
  );

  const addFavouriteItem = (item: FaveItem) => {
    dispatchFavouriteAction({ type: "ADD", item: item });
  };

  const removeFavouriteItem = (id: string | number) => {
    dispatchFavouriteAction({ type: "REMOVE", id: id });
  };

  const faveContext = {
    items: favouriteState.favouriteItems,
    addItem: addFavouriteItem,
    removeItem: removeFavouriteItem,
  };

  return (
    <FaveContext.Provider value={faveContext}>
      {children}
    </FaveContext.Provider>
  );
};

export default FaveProvider;
