"use client";

import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CartContext, { CartItem } from "@/providers/cart/cart-context";
import { CartItems } from "./cart-item";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface CartProps {
  openCart: boolean;
}

export const Cart = ({ openCart }: CartProps) => {
  const [open, setOpen] = useState(openCart);
  const [toggleCheck, setToggleCheck] = useState(false);

  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [hasSubmitted, setHasSubmitted] = useState(false);
  const cartCtx = useContext(CartContext);
  const totalAmount = cartCtx.totalAmount;
  // const hasItems = cartCtx.items.length > 0;

  useEffect(() => {
    if (window.location.hash === "#cart") {
      setOpen(true);
    }
  }, []);

  console.log(window.location.hash);

  console.log(cartCtx.items);
  // localStorage.setItem("cartItem", JSON.stringify(cartCtx.items));

  // const storedCartItems = JSON.parse(localStorage.getItem("cartItem"));
  // console.log(storedCartItems);
  
  const cartItemRemoveHandler = (id: string | number) => {
    cartCtx.removeItem(id);

  };

  const cartItemAddHandler = (item: CartItem) => {
    cartCtx.addItem({ ...item, quantity: 1 });
  };

  const checkoutHandler = () => {
    setToggleCheck(true);
    setOpen(!open);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              id="cart"
              className="pointer-events-none fixed inset-y-0  right-0 flex max-w-full pl-10"
            >
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => {
                              setOpen(false);
                              location.href = "/";
                            }}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul className="-my-6 divide-y divide-gray-200">
                            {cartCtx.items.map((item) => (
                              <CartItems
                                key={item.id}
                                name={item.name}
                                quantity={item.quantity}
                                price={item.price}
                                image={item.image}
                                category={item.category}
                                onRemove={cartItemRemoveHandler.bind(
                                  null,
                                  item.id
                                )}
                                onAdd={cartItemAddHandler.bind(null, item)}
                                id={item.id}
                              />
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${totalAmount.toFixed(2)}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <Link
                          href="/checkout"
                          className="flex items-center justify-center rounded-md border border-transparent bg-orange-400 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-orange-600"
                          onClick={checkoutHandler}
                        >
                          Checkout
                        </Link>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or &nbsp;
                          <button
                            type="button"
                            className="font-medium text-orange-400 hover:text-orange-500"
                            onClick={() => setOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
