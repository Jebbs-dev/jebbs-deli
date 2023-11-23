import React, { MouseEventHandler } from "react";
import { StaticImageData } from "next/image";

export interface FaveItem {
  id: string | number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
};

export interface FaveItem {
  addToCartHandler?: MouseEventHandler<HTMLButtonElement> | undefined;
}

type FaveContextType = {
  items: FaveItem[],
  addItem: (item: FaveItem) => void,
  removeItem: (id: string | number) => void
}

const initialFaveContext: FaveContextType = {
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
};

const FaveContext = React.createContext<FaveContextType>(initialFaveContext)

export default FaveContext;
