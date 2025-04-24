"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import CartSheet, { FetchedCartData } from "../cart/components/cart-sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  FileClock,
  LogOut,
  MapPin,
  Settings,
} from "lucide-react";
import useAuthStore from "@/store/auth";
import { useRouter } from "next/navigation";
import { useFetchCart } from "../cart/queries/fetch-cart";
import useCartStore from "@/store/cart";
import { useCartViewStore } from "@/store/cart-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PlacesAutocomplete from "@/components/map/places-autocomplete";
import { useUpdateUser } from "@/modules/user/mutations/update-user";
import { useFetchUserInformation } from "@/modules/user/queries/fetch-user-information";

export type Prediction = google.maps.places.AutocompletePrediction;

const Header = () => {


  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const { isOpen, setIsOpen } = useCartViewStore();

  const { user, isLoggedIn, logout } = useAuthStore();
  const { data: userInformation } = useFetchUserInformation(String(user?.id));

  const { totalItems } = useCartStore();
  const router = useRouter();

  // Fetch cart data
  const { data: fetchedCartData } = useFetchCart(
    user?.id ? String(user.id) : ""
  );
  const totalCartItems =
    (fetchedCartData as FetchedCartData)?.cartGroups
      ?.flatMap((group) => group.cartItems)
      .reduce((sum, item) => sum + item.quantity, 0) || 0;

  console.log("from header", input);

  return (
    <>
      <CartSheet />
      <header className="border-b border-x-gray-100 fixed w-full left-0 z-50 bg-white">
        <div className="w-full bg-white flex justify-between h-[75px] md:h-[81px] px-4 md:px-10 mx-auto py-4">
          <div className="flex md:flex-row gap-10">
            <Link href="/shop" className="flex items-center">
              <h1 className="mx-auto md:top-10 md:left-10 text-black text-2xl md:text-3xl">
                deli<span className="text-orange-400">.</span>
              </h1>
            </Link>

            <Dialog>
              <DialogTrigger className="flex flex-row items-center gap-2">
                <MapPin className="text-green-600" size={18} />
                <p className="text-sm">{userInformation?.address} </p>
                <ChevronDown size={18} />
              </DialogTrigger>
              <DialogContent className="h-[500px] p-10">
                <DialogHeader className="flex flex-col gap-5">
                  <DialogTitle className="text-lg md:text-2xl text-left font-semibold text-orange-400">
                    Delivery Address
                  </DialogTitle>
                  <div className="relative text-gray-600 w-full">
                    <span className="absolute top-0 bottom-0 left-2 flex items-center">
                      <MapPin className="text-green-600" />
                    </span>
                    <PlacesAutocomplete
                      input={input}
                      setInput={setInput}
                      predictions={predictions}
                      setPredictions={setPredictions}
                    />
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center space-x-5">
            <div className="relative text-gray-600  hidden md:flex">
              <span className="absolute top-0.5 bottom-0 left-0 flex items-center">
                <Button
                  type="submit"
                  className="bg-transparent hover:bg-transparent"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z"
                      stroke="#0C513F"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M15 15L21 21"
                      stroke="#0C513F"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </Button>
              </span>
              <Input className="pl-10 w-80 py-2" />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                className="relative bg-orange-400 flex items-center justify-center rounded-full w-[30px] h-[30px] md:w-[45px] md:h-[45px] text-white shadow-indigo-500/40"
                aria-label="Cart"
                onClick={() => {
                  setIsOpen(true)
                }}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  height="22"
                  width="22"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21.822 7.431A1 1 0 0 0 21 7H7.333L6.179 4.23A1.994 1.994 0 0 0 4.333 3H2v2h2.333l4.744 11.385A1 1 0 0 0 10 17h8c.417 0 .79-.259.937-.648l3-8a1 1 0 0 0-.115-.921zM17.307 15h-6.64l-2.5-6h11.39l-2.25 6z"></path>
                  <circle cx="10.5" cy="19.5" r="1.5"></circle>
                  <circle cx="17.5" cy="19.5" r="1.5"></circle>
                </svg>
                {(isLoggedIn ? totalCartItems : totalItems) > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                    {totalCartItems || totalItems}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="relative bg-orange-400 flex items-center justify-center rounded-full w-[30px] h-[30px] md:w-[45px] md:h-[45px] shadow-indigo-500/40"
                    aria-label="User Icon"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21"
                        stroke="#fff"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                        stroke="#fff"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">
                      Order History
                      <DropdownMenuShortcut>
                        <FileClock size={18} />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Settings
                      <DropdownMenuShortcut>
                        <Settings size={18} />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                        router.push("/shop");
                      }}
                    >
                      Logout
                      <DropdownMenuShortcut>
                        <LogOut size={18} />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="flex justify-center mb-2 md:hidden">
          <div className="relative text-gray-600">
            <span className="absolute top-0.5 bottom-0 left-0 flex items-center">
              <Button
                type="submit"
                className="bg-transparent hover:bg-transparent"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z"
                    stroke="#0C513F"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M15 15L21 21"
                    stroke="#0C513F"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </Button>
            </span>
            <Input className="pl-10 w-80 py-2" />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
