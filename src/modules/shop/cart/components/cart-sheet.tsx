"use client";

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
import CheckoutPage from "@/modules/checkout/components/checkout-page";
import CartPage from "./cart-page";
import { useCartViewStore } from "@/store/cart-data";

interface CartProps {
  isOpen: boolean;
  setIsOpen(value: boolean): void;
}

export interface StoreTotal {
  storeId: string;
  vendorStoreName: string;
  totalQuantity: number;
  totalAmount: number;
  products: CartItemProps[];
  billboard?: string;
}

export interface CartStoreGroup {
  id: string;
  cartId: string;
  storeId: string;
  store: {
    id: string;
    name: string;
  };
  cartItems: {
    id: string;
    quantity: number;
    product: Product & {
      id: string;
    };
  }[];
}

export interface FetchedCartData {
  id: string;
  userId: string;
  totalPrice: number;
  cartGroups: CartStoreGroup[];
}

const CartSheet = () => {
  const {
    items,
    totalAmount,
    addItem,
    removeItem,
    clearCart,
    clearVendorItems,
  } = useCartStore();
  const { isLoggedIn, user } = useAuthStore();
  const { onAuthFormOpen } = useAuthFormModal();

  const { mutateAsync: addCart } = useAddToCart();
  const { mutateAsync: updateCart } = useUpdateCart();
  const { mutateAsync: removeCart } = useRemoveFromCart();

  const { data: fetchedCartData, isLoading } = useFetchCart(String(user?.id));

  // Effect to sync local cart to backend when user logs in
  useEffect(() => {
    if (isLoggedIn && user?.id && items.length > 0) {
      // Small delay to ensure auth is fully complete
      const syncCartToBackend = setTimeout(async () => {
        try {
          const localStorageCart = JSON.parse(
            localStorage.getItem("jebbs-cart-storage") ||
              '{"state":{"items":[]}}'
          );

          const cartItems = localStorageCart?.state?.items || [];

          if (cartItems.length > 0) {
            await addCart({
              cartItems,
              totalPrice: totalAmount,
              userId: user.id,
            });

            // Clear local storage cart after moving to backend
            localStorage.removeItem("jebbs-cart-storage");
            clearCart(); // Clear the local cart store
          }
        } catch (error) {
          console.error("Failed to sync cart to backend:", error);
        }
      }, 1000);

      return () => clearTimeout(syncCartToBackend);
    }
  }, [addCart, isLoggedIn, totalAmount, user, items, clearCart]);

  useEffect(() => {
    if (fetchedCartData || items) {
      initializeCartData(fetchedCartData, items, isLoggedIn);
    }
  }, [fetchedCartData, items, isLoggedIn]);

  const {
    isOpen,
    setIsOpen,
    initializeCartData,
    toggleCartView,
    setToggleCartView,
    cartItemsToUse,
  } = useCartViewStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AuthModal />
      <Sheet
        open={isOpen}
        onOpenChange={() => {
          setIsOpen(false);
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-[500px]">
          {toggleCartView === "cart" ? (
            <CartPage
              goToCheckout={() => {
                setToggleCartView("checkout");
              }}
            />
          ) : (
            <CheckoutPage
              goToCart={() => {
                setToggleCartView("cart");
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartSheet;
