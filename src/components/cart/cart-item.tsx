import React from "react";
import { CartItem } from "@/providers/cart/cart-context";
import Image from "next/image";

export const CartItems = (props: CartItem) => {
  const price = props.price;
  return (
    <>
      <div>
        <li key={props.id} className="flex py-6">
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
            <Image
              src={props.image} width={100} height={100}
              className="object-cover object-center" alt={""}            />
          </div>

          <div className="ml-4 flex flex-1 flex-col">
            <div>
              <div className="flex justify-between text-base font-medium text-gray-900">
                <h3>
                  <a href={""}>{props.name}</a>
                </h3>
                <p className="ml-4">${price.toFixed(2)}</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">{props.category}</p>
            </div>
            <div className="flex flex-1 items-end justify-between text-sm">
              <p className="text-gray-500">Qty {props.quantity}</p>
              <button
                className="font-medium text-orange-400 hover:text-orange-600"
                onClick={props.onAdd}
              >
                Add
              </button>
              <div className="flex">
                <button
                  type="button"
                  className="font-medium text-orange-400 hover:text-orange-600"
                  onClick={props.onRemove}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </li>
      </div>
    </>
  );
};

