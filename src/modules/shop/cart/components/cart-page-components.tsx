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
import { useCartViewStore } from "@/store/cart-data";
import { useFetchOrders } from "@/modules/checkout/queries/fetch-order-by-userId";

interface VendorPageProps {
  storeId: string;
}
const CartPageComponents = ({ storeId }: VendorPageProps) => {
  const { mutateAsync: updateCart } = useUpdateCart();

  const { addItem, removeItem, clearCart, clearVendorItems } = useCartStore();

  const {
    storeTotals,
    typedCartData,
    cartItemsToUse,
    openStoreId,
    setOpenStoreId,
    handleClearVendorItems,
    setToggleCartView,
  } = useCartViewStore();

  const { onAuthFormOpen } = useAuthFormModal();

  const { isLoggedIn, user } = useAuthStore();

  // Filter store totals to only include the current store
  const currentStore = storeTotals.find((store) => store.storeId === storeId);

  return (
    <div className="flex flex-col justify-between h-full mb-3">
      <div className="overflow-auto">
        {currentStore ? (
          <div className="mb-6 border border-gray-200 p-6 rounded-xl">
            <h3 className="font-medium text-lg">
              {currentStore.vendorStoreName}
            </h3>
            <ul className="divide-y divide-gray-200 transition">
              {currentStore.products.map((item) => (
                <CartItem
                  key={item.id}
                  items={{
                    ...item,
                    onRemove: () => removeItem(item.id),
                    onAdd: () => addItem(item),
                    cartId: isLoggedIn ? user?.id : undefined,
                  }}
                />
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="mx-auto w-[300px] h-[300px] flex items-center justify-center">
              <div className="text-gray-400">
                No items in the cart for this store.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bottom-0 w-full border-t border-gray-200 px-4 pb-6 sm:px-6 mt-4">
        <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
          <p>Total Amount</p>
          <p>
            ₦
            {currentStore?.totalAmount
              ? formatNumberWithCommas(
                  Number(currentStore.totalAmount.toFixed(2))
                )
              : Number(0.0).toFixed(2)}
          </p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
        <div className="my-6">
          <div className="mt-4 flex flex-col gap-4">
            <Button
              asChild
              onClick={() => {
                if (!isLoggedIn) {
                  onAuthFormOpen();
                } else {
                  setToggleCartView("checkout");
                }
              }}
            >
              <span
                className="flex items-center justify-center rounded-md border border-transparent bg-orange-400 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-orange-600"
                onClick={() =>
                  setOpenStoreId(openStoreId === storeId ? null : storeId)
                }
              >
                Proceed to checkout
              </span>
            </Button>
            <Button
              className="w-full bg-red-100 px-6 py-3 text-red-500 text-sm hover:bg-red-200"
              onClick={() => {
                handleClearVendorItems(
                  storeId,
                  isLoggedIn,
                  String(user?.id),
                  updateCart,
                  clearVendorItems
                );
              }}
            >
              Clear all Items
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageComponents;
