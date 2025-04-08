"use client";

import React, {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { Signin } from "@/modules/auth/components/forms/signin";

import {
  FaMagnifyingGlass,
  FaCartShopping,
  FaHeart,
  FaBars,
} from "react-icons/fa6";
import { Signup } from "@/modules/auth/components/forms/signup";
import CartContext from "@/providers/cart/cart-context";
import { Cart } from "@/components/cart/cart";
import { useRouter } from "next/navigation";

interface navProps {
  setToggleCheck: Dispatch<SetStateAction<boolean>>;
}

export const Navbar = () => {
  const [scrollNav, setScrollNav] = useState(false);
  const [inputShow, setInputShow] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const [faves, setFaves] = useState(false);

  const router = useRouter();

  const [openCart, setOpenCart] = useState(false);

  const cartCtx = useContext(CartContext);
  const itemsAlert = cartCtx.items.reduce((currNumber: number, item) => {
    return currNumber + item.quantity;
  }, 0);


  const toggleCart = () => {
    setOpenCart((prevOpenCart) => !prevOpenCart);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [router.push]);

  const toggleFaves = () => {
    setFaves(true);
  };

  const changeNav = () => {
    if (window.scrollY >= 80) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNav);
  }, []);

  const navToggle = () => {
    setIsOpen(!isOpen);
  };

  const toggleInput = () => {
    setInputShow(true);
  };

  return (
    <>
      <nav
        className={`nav sticky w-full z-20 top-0 left-0 h-20 border-gray-200 ${
          scrollNav ? "bg-stone-50" : ""
        }`}
        id="nav"
      >
        <div className="max-w-[90vw] flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/img-bg-logo.png"
              width={50}
              height={50}
              alt="deliLogo"
              className="h-10 w-10 mr-2"
            />
            <span className="font-semibold text-slate-900 text-lg">
              Jebbs Deli
            </span>
          </Link>

          <div className="">
            <button
              onClick={navToggle}
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-900 rounded-lg  int:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <FaBars className="w-4 h-4 opacity-25" aria-hidden="true" />
            </button>
          </div>

          <div
            className={`show-nav justify-between w-full int:flex int:absolute int:ml-[15vw] int:w-auto int:order-1 ${
              isOpen ? "hidden" : ""
            }`}
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 int:p-0 mt-4 font-medium border rounded-lg int:flex-row int:space-x-8 int:mt-0 md:border-0 lg:bg-transparent md:w-1/2 bg-orange-100 z-10 md:float-right">
              <li>
                <Link
                  href="/"
                  className={`active [&.active]:text-orange-400 block py-2 md:pl-3 md:pr-4 bg-opacity-10 rounded md:bg-transparent md:hover:text-orange-700 int:p-0`}
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className={`[&:active]:text-orange-400 block py-2 md:pl-3 md:pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-700 int:p-0`}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="#menu"
                  className={` [&.active]:text-orange-400 block py-2 md:pl-3 md:pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-700 int:p-0`}
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className={` [&.active]:text-orange-400 block py-2 md:pl-3 md:pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-700 int:p-0`}
                >
                  Contact
                </Link>
              </li>
              <div className="show-nav int:hidden md:p-4 w-full int:w-auto">
                <li>
                  <div className="relative mt-3 md:mt-0">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaMagnifyingGlass className="w-4 h-4 opacity-25" />
                      <span className="sr-only">Search icon</span>
                    </div>
                    <input
                      type="text"
                      id="search-navbar"
                      className="block w-full p-3 pl-10 text-sm text-gray-900 border border-orange-400 rounded-lg bg-orange-100 bg-opacity-5 focus:ring-orange-400 focus:outline-orange-400 active:outline-orange-400"
                      placeholder="Search meals"
                    />
                  </div>
                </li>
                <Link href="/cart">
                  <li>
                    <button className="block rounded-md w-full bg-orange-400 px-4 py-2 border-solid border-[1px] border-orange-400 mr-3 my-3">
                      <FaCartShopping
                        className="w-4 h-4 mx-auto"
                        style={{ color: "#fff" }}
                      />
                    </button>
                  </li>
                </Link>
                <li>
                  <button
                    className="rounded-md w-full bg-orange-400 px-4 py-2 border-solid border-[1px] border-orange-400 mr-3 mb-3"
                    // onClick={toggleFaves}
                  >
                    <Link href="/favourites">
                      <FaHeart
                        className="w-4 h-4 mx-auto"
                        style={{ color: "#fff" }}
                      />
                    </Link>
                  </button>
                </li>
                <li>
                  <Link href="/auth">
                    <button
                      type="button"
                      data-modal-target="defaultModal"
                      data-modal-toggle="defaultModal"
                      className="block w-full text-white  rounded-md bg-orange-400 hover:bg-browned focus:ring-4 focus:outline-none font-medium text-sm px-4 py-3 text-center"
                    >
                      Get started
                    </button>
                  </Link>
                </li>
              </div>
            </ul>
          </div>
          <div className="show-nav hidden w-full int:flex int:w-auto">
            {inputShow ? (
              <div className="relative mr-3">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaMagnifyingGlass className="w-4 h-4 opacity-25" />
                  <span className="sr-only">Search icon</span>
                </div>
                <input
                  type="text"
                  id="search-navbar"
                  className="block w-full p-3  pl-10 text-sm text-gray-900 border border-orange-400 rounded-lg bg-orange-400 bg-opacity-5 focus:ring-orange-400 focus:outline-orange-400 active:outline-orange-400"
                  placeholder="Search meals"
                />
              </div>
            ) : (
              <button
                className="rounded-md px-4 py-2 border-solid border-[1px] border-orange-400 mr-3"
                onClick={toggleInput}
              >
                <FaMagnifyingGlass
                  className="w-4 h-4 opacity-25"
                  style={{ color: "#FB923C" }}
                />
              </button>
            )}
            <button
              onClick={toggleCart}
              className="rounded-md px-4 py-2 border-solid border-[1px] hover:bg-orange-500 border-orange-400 mr-3"
            >
              <Link href="#cart">
                <FaCartShopping
                  id="cartoo"
                  className="w-4 h-4 opacity-25 "
                  style={{ color: "#FB923C" }}
                />
                <span className="text-red-600 absolute top-[18px] right-[280px] z-[999]">
                  {itemsAlert}
                </span>
              </Link>
            </button>
            <button
              onClick={toggleFaves}
              className="rounded-md px-4 py-2 border-solid border-[1px] border-orange-400 hover:bg-orange-500 mr-3"
            >
              <Link href="/favourites">
                <FaHeart
                  className="w-4 h-4 opacity-25"
                  style={{ color: "#FB923C" }}
                />
              </Link>
            </button>

            <Link href="/auth">
              <button
                type="button"
                data-modal-target="defaultModal"
                data-modal-toggle="defaultModal"
                className="block text-white rounded-md bg-orange-400 hover:bg-browned  focus:outline-orange-400 focus:ring-1 font-medium text-sm px-4 py-3 text-center"
              >
                Get started
              </button>
            </Link>
          </div>
        </div>
      </nav>
      {openCart ? <Cart openCart={openCart} /> : null}
    </>
  );
};
