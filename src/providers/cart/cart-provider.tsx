"use client";

import { useReducer } from "react";
import React from "react";
import CartContext, { CartItem } from "./cart-context";

type CartState = {
  items: CartItem[];
  totalAmount: number;
};

type AppAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; id: string | number }
  | { type: "CLEAR" };

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (
  state: CartState = defaultCartState,
  action: AppAction
) => {
  if (action.type === "ADD") {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.quantity;

    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems;

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + action.item.quantity,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === "REMOVE") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );

    const existingItem = state.items[existingCartItemIndex];

    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;

    if (existingItem.quantity === 1) {
      updatedItems = state.items.filter((item) => item.id !== action.id);
    } else {
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity - 1,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === "CLEAR") {
    return defaultCartState;
  }

  return defaultCartState;
};

type childrenProps = {
  children: React.ReactNode;
};

const CartProvider = ({ children }: childrenProps) => {
  // The goal of this is to manage the current context data and provide that context to all components that want access to it.

  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item: CartItem) => {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeFromCartHandler = (id: string | number) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const clearCartHandler = () => {
    dispatchCartAction({ type: "CLEAR" });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeFromCartHandler,
    clearCart: clearCartHandler,
  };

  return (
    <>
      <CartContext.Provider value={cartContext}>
        {children}
      </CartContext.Provider>
    </>
  );
};

export default CartProvider;
