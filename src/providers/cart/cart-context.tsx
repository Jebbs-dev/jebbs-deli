import { StaticImageData } from "next/image";
import React, { MouseEventHandler } from "react";

export interface CartItem {
  id: string | number;
  name: string;
  quantity: number;
  category: string;
  price: number;
  image: StaticImageData;
};

export interface CartItem {
  onRemove?: MouseEventHandler<HTMLButtonElement>;
  onAdd?: MouseEventHandler<HTMLButtonElement>;
}

type CartContextType = {
  items: CartItem[];
  totalAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string | number) => void;
  clearCart: () => void;
};

const initialCartContext: CartContextType = {
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
};

const CartContext = React.createContext<CartContextType>(initialCartContext);

export default CartContext;
