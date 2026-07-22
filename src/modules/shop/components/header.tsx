"use client";

import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import CartSheet, { FetchedCartData } from "../cart/components/cart-sheet";
import { ChevronDown, MapPin, Search } from "@/components/icons";
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
import PlacesAutocomplete, {
  type PlacePrediction,
} from "@/components/map/places-autocomplete";
import { useFetchUserInformation } from "@/modules/user/queries/fetch-user-information";
import OrderHistory from "@/modules/checkout/components/order-history";
import { useQueryParamaters } from "@/store/use-query-parameters";
import { ProfilePopover } from "./profile-popover";
import { CartPopover } from "../cart/components/cart-popover";
import { useUpdateUser } from "@/modules/user/mutations/update-user";
import { useAddAddress } from "@/modules/user/mutations/add-address";
import { useToast } from "@/hooks/use-toast";

export type Prediction = PlacePrediction;

const Header = () => {
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<PlacePrediction | null>(null);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [isApplyingAddress, setIsApplyingAddress] = useState(false);
  const { setQueryKey } = useQueryParamaters();
  const { user, isLoggedIn } = useAuthStore();
  const { data: userInformation } = useFetchUserInformation(String(user?.id));
  const { totalItems } = useCartStore();
  const { mutateAsync: updateUser } = useUpdateUser(String(user?.id));
  const { mutateAsync: addAddress } = useAddAddress();
  const { toast } = useToast();

  const { data: fetchedCartData } = useFetchCart(
    user?.id ? String(user.id) : ""
  );
  const totalCartItems =
    (fetchedCartData as FetchedCartData)?.cartGroups
      ?.flatMap((group) => group.cartItems)
      .reduce((sum, item) => sum + item.quantity, 0) || 0;

  const cartCount = isLoggedIn ? totalCartItems : totalItems;
  const headerAddress =
    userInformation?.address || selectedLocation?.description || null;

  const applySelectedLocation = async () => {
    if (!selectedLocation) return;

    setIsApplyingAddress(true);
    try {
      if (isLoggedIn && user?.id) {
        await updateUser({
          address: selectedLocation.description,
        });
        await addAddress({
          description: selectedLocation.description,
          place_id: selectedLocation.place_id,
          reference: selectedLocation.place_id,
          types: selectedLocation.types,
        });
      }

      setInput("");
      setPredictions([]);
      setAddressDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Could not save address",
        description: "Please try selecting the location again.",
      });
    } finally {
      setIsApplyingAddress(false);
    }
  };

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

            <Dialog
              open={addressDialogOpen}
              onOpenChange={(open) => {
                setAddressDialogOpen(open);
                if (!open) {
                  setPredictions([]);
                  setInput("");
                }
              }}
            >
              <DialogTrigger className="flex min-w-0 max-w-[10rem] cursor-pointer items-center gap-1.5 text-left text-ash/80 transition-colors hover:text-ash sm:max-w-xs">
                <MapPin className="shrink-0 text-scotch" size={18} />
                <p className="truncate text-sm font-medium">
                  {headerAddress || "Set delivery address"}
                </p>
                <ChevronDown size={16} className="shrink-0 opacity-50" />
              </DialogTrigger>
              <DialogContent className="min-h-[420px] overflow-visible border-black/10 bg-white p-8 text-ash sm:max-w-lg">
                <DialogHeader className="flex flex-col gap-5 text-left">
                  <DialogTitle className="text-left text-xl font-semibold text-ash md:text-2xl">
                    Delivery Address
                  </DialogTitle>
                  <div className="relative w-full overflow-visible">
                    <span className="pointer-events-none absolute inset-y-0 left-2 z-10 flex items-center">
                      <MapPin className="text-scotch" size={18} />
                    </span>
                    <PlacesAutocomplete
                      input={input}
                      setInput={setInput}
                      predictions={predictions}
                      setPredictions={setPredictions}
                      onLocationPicked={(prediction) => {
                        setSelectedLocation(prediction);
                      }}
                    />
                  </div>
                </DialogHeader>

                {predictions.length === 0 ? (
                  <div className="mt-8 flex flex-1 flex-col items-center justify-center px-4 pb-4 text-center">
                    <div className="relative mb-5 flex h-28 w-28 items-center justify-center">
                      <span
                        className="absolute inset-0 rounded-full bg-scotch/10"
                        aria-hidden
                      />
                      <span
                        className="absolute inset-3 rounded-full border border-dashed border-scotch/25"
                        aria-hidden
                      />
                      <MapPin
                        className="relative size-12 text-scotch"
                        aria-hidden
                      />
                    </div>
                    <p className="font-display text-base font-semibold text-ash">
                      Select a location
                    </p>
                    {selectedLocation ? (
                      <button
                        type="button"
                        onClick={() => void applySelectedLocation()}
                        disabled={isApplyingAddress}
                        className="mt-3 max-w-full cursor-pointer rounded-lg border border-scotch/30 bg-scotch/10 px-4 py-3 text-left transition-colors hover:bg-scotch/15 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="flex items-start gap-2">
                          <MapPin
                            className="mt-0.5 size-4 shrink-0 text-scotch"
                            aria-hidden
                          />
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-ash">
                              {selectedLocation.description}
                            </span>
                            <span className="mt-1 block text-xs text-ash/55">
                              {isApplyingAddress
                                ? "Saving…"
                                : "Tap to set as your delivery address"}
                            </span>
                          </span>
                        </span>
                      </button>
                    ) : (
                      <p className="mt-1.5 max-w-[28ch] text-sm leading-relaxed text-ash/55">
                        Search above and pick where you want your order
                        delivered.
                      </p>
                    )}
                  </div>
                ) : null}
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
