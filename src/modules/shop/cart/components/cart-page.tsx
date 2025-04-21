import React, { Dispatch, SetStateAction } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Cart, Product } from "@/types/types";
import Image from "next/image";
import useCartStore, { CartItemProps } from "@/store/cart";
import CartItem from "./cart-item";
import Link from "next/link";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import useAuthStore from "@/store/auth";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { useUpdateCart, useRemoveFromCart } from "../mutations/update-cart";
import { useAddToCart } from "../mutations/add-to-cart";
import { useAuthFormModal } from "@/store/auth-form-modal";
import AuthModal from "@/modules/auth/components/auth-modal";
import { useFetchCart } from "../queries/fetch-cart";
import { FetchedCartData, StoreTotal } from "./cart-sheet";

interface CartProps {
  handleClearVendorItems(storeId: string): void;
  goToCheckout: () => void;
  storeTotals: StoreTotal[];
  typedCartData: FetchedCartData | undefined;
  cartTotal: any;
  cartItemsToUse: any;
  openStoreId: string | null;
  setOpenStoreId: Dispatch<SetStateAction<string | null>>;
}

const CartPage = ({
  handleClearVendorItems,
  storeTotals,
  typedCartData,
  cartTotal,
  cartItemsToUse,
  goToCheckout,
  openStoreId,
  setOpenStoreId,
}: CartProps) => {
  const { mutateAsync: updateCart } = useUpdateCart();

  const {
    items,
    totalAmount,
    addItem,
    removeItem,
    clearCart,
    clearVendorItems,
  } = useCartStore();

  const { onAuthFormOpen } = useAuthFormModal();

  const { isLoggedIn, user } = useAuthStore();

  return (
    <>
      <AuthModal />

      <SheetHeader className="mb-4">
        <SheetTitle>My Cart</SheetTitle>
      </SheetHeader>

      <div className="flex flex-col justify-between h-full mb-3">
        <div className="overflow-auto">
          {storeTotals.map((store) => (
            <div
              key={store.storeId}
              className="mb-6 border border-gray-200 p-6 rounded-xl"
            >
              <div className="flex flex-col items-start gap-2 mb-2 bg-orange-50 p-2 rounded-md">
                <div className="flex flex-row justify-between w-full">
                  <h3 className="font-medium text-orange-700">
                    {store.vendorStoreName}
                  </h3>

                  <p
                    className="flex flex-row items-center text-sm text-orange-600 cursor-pointer"
                    onClick={() =>
                      setOpenStoreId(
                        openStoreId === store.storeId ? null : store.storeId
                      )
                    }
                  >
                    Show selection
                    <ArrowDown className="ml-2" size={18} />{" "}
                  </p>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="text-sm text-orange-600">
                    ₦
                    {formatNumberWithCommas(
                      Number(store.totalAmount.toFixed(2))
                    )}
                  </span>
                  <span className="text-sm text-orange-600 border-l pl-4 border-orange-200">
                    {store.totalQuantity}{" "}
                    {store.totalQuantity === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>
              {openStoreId === store.storeId && (
                <ul className="divide-y divide-gray-200 transition">
                  {store.products.map((item) => (
                    <CartItem
                      key={item.id}
                      items={{
                        ...item,
                        onRemove: () => removeItem(item.id),
                        onAdd: () => addItem(item),
                        cartId: isLoggedIn ? typedCartData?.id : undefined,
                      }}
                    />
                  ))}
                </ul>
              )}
              <div className="mt-4 flex flex-col gap-4">
                <Button
                  asChild
                  onClick={() => {
                    if (!isLoggedIn) {
                      onAuthFormOpen();
                    } else {
                      goToCheckout();
                    }
                  }}
                >
                  <span
                    className="flex items-center justify-center rounded-md border border-transparent bg-orange-400 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-orange-600"
                    onClick={() =>
                      setOpenStoreId(
                        openStoreId === store.storeId ? null : store.storeId
                      )
                    }
                  >
                    Proceed to checkout
                  </span>
                </Button>
                <Button
                  className="w-full bg-red-100 px-6 py-3 text-red-500 text-sm hover:bg-red-200"
                  onClick={() => handleClearVendorItems(store.storeId)}
                >
                  Clear {store.vendorStoreName}&apos;s Items
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bottom-0 w-full border-t border-gray-200 px-4 pb-6 sm:px-6 mt-4">
          {/* <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
            <p>Total Amount</p>
            <p>₦{formatNumberWithCommas(Number(cartTotal.toFixed(2)))}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p> */}
          <div className="my-6">
            {/* <Button
              
              className="flex items-center justify-center rounded-md border border-transparent bg-orange-400 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-orange-600"
              onClick={() => {
                if (!isLoggedIn) {
                  onAuthFormOpen();
                } else {
                  goToCheckout();
                }
              }}
            >
              Proceed to checkout
            </Button> */}
            {cartItemsToUse.length > 0 && (
              <Button
                className="mt-3 w-full bg-red-200 px-6 py-3 text-red-500 text-sm hover:bg-red-300"
                onClick={async () => {
                  if (isLoggedIn && user?.id && typedCartData?.id) {
                    try {
                      console.log(
                        "Clearing all items from cart - removing all cart groups"
                      );

                      // Clear the backend cart by sending an empty items array
                      // This will remove all cart groups since there are no items
                      const result = await updateCart({
                        cartId: typedCartData.id,
                        userId: user.id,
                        cartItems: [], // Empty array will clear all cart groups
                        totalPrice: 0,
                      });

                      console.log("Clear all items result:", result);
                    } catch (error) {
                      console.error("Failed to clear cart:", error);
                    }
                  } else {
                    // Clear the local cart
                    clearCart();
                  }
                }}
              >
                Clear All Items
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
