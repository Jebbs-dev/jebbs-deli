"use client";

import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import CartSheet, { FetchedCartData } from "../cart/components/cart-sheet";
import { ChevronDown, MapPin, Search } from "lucide-react";
import useAuthStore from "@/store/auth";
import { useFetchCart } from "../cart/queries/fetch-cart";
import useCartStore from "@/store/cart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PlacesAutocomplete from "@/components/map/places-autocomplete";
import { useFetchUserInformation } from "@/modules/user/queries/fetch-user-information";
import OrderHistory from "@/modules/checkout/components/order-history";
import { useQueryParamaters } from "@/store/use-query-parameters";
import { ProfilePopover } from "./profile-popover";
import { CartPopover } from "../cart/components/cart-popover";

export type Prediction = google.maps.places.AutocompletePrediction;

const Header = () => {
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const { setQueryKey } = useQueryParamaters();
  const { user, isLoggedIn } = useAuthStore();
  const { data: userInformation } = useFetchUserInformation(String(user?.id));
  const { totalItems } = useCartStore();

  const { data: fetchedCartData } = useFetchCart(
    user?.id ? String(user.id) : ""
  );
  const totalCartItems =
    (fetchedCartData as FetchedCartData)?.cartGroups
      ?.flatMap((group) => group.cartItems)
      .reduce((sum, item) => sum + item.quantity, 0) || 0;

  const cartCount = isLoggedIn ? totalCartItems : totalItems;

  return (
    <>
      <CartSheet />
      <OrderHistory />
      <header className="fixed left-0 top-0 z-50 w-full border-b border-black/5 bg-white">
        <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between gap-4 px-4 md:h-[81px] md:px-8">
          <div className="flex min-w-0 items-center gap-4 md:gap-8">
            <Link to="/shop" className="shrink-0">
              <span className="font-display text-2xl font-bold text-ash md:text-[1.75rem]">
                deli<span className="text-scotch">.</span>
              </span>
            </Link>

            <Dialog>
              <DialogTrigger className="flex min-w-0 max-w-[10rem] items-center gap-1.5 text-left text-ash/80 transition-colors hover:text-ash sm:max-w-xs">
                <MapPin className="shrink-0 text-scotch" size={18} />
                <p className="truncate text-sm font-medium">
                  {userInformation?.address || "Set delivery address"}
                </p>
                <ChevronDown size={16} className="shrink-0 opacity-50" />
              </DialogTrigger>
              <DialogContent className="border-black/10 bg-white p-8 text-ash sm:max-w-lg">
                <DialogHeader className="flex flex-col gap-5">
                  <DialogTitle className="text-left text-xl font-semibold text-ash md:text-2xl">
                    Delivery Address
                  </DialogTitle>
                  <div className="relative w-full">
                    <span className="pointer-events-none absolute inset-y-0 left-2 z-10 flex items-center">
                      <MapPin className="text-scotch" size={18} />
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

          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative hidden md:block">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ash/40"
                aria-hidden
              />
              <Input
                placeholder="Search kitchens or dishes"
                aria-label="Search kitchens or dishes"
                className="h-10 w-72 rounded-full border-black/10 bg-[#f5f5f5] pl-10 text-ash placeholder:text-ash/40 focus-visible:ring-scotch"
                onChange={(e) => setQueryKey(e.target.value)}
              />
            </div>

            <CartPopover cartCount={cartCount} />
            <ProfilePopover />
          </div>
        </div>

        <div className="border-t border-black/5 px-4 pb-3 md:hidden">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ash/40"
              aria-hidden
            />
            <Input
              placeholder="Search kitchens or dishes"
              aria-label="Search kitchens or dishes"
              className="h-10 w-full rounded-full border-black/10 bg-[#f5f5f5] pl-10 text-ash placeholder:text-ash/40 focus-visible:ring-scotch"
              onChange={(e) => setQueryKey(e.target.value)}
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
