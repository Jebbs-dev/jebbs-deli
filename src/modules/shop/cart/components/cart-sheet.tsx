"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Product } from "@/types/types";
import useCartStore, { CartItemProps } from "@/store/cart";
import useAuthStore from "@/store/auth";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAddToCart } from "../mutations/add-to-cart";
import AuthModal from "@/modules/auth/components/auth-modal";
import { useFetchCart } from "../queries/fetch-cart";
import CheckoutPage from "@/modules/checkout/components/checkout-page";
import CartPage from "./cart-page";
import { useCartViewStore } from "@/store/cart-data";
import { useAuthFormModal } from "@/store/auth-form-modal";

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
  const { items, totalAmount, clearCart } = useCartStore();
  const { isLoggedIn, user } = useAuthStore();
  const { onAuthFormOpen } = useAuthFormModal();
  const queryClient = useQueryClient();
  const hasSyncedLocalCart = useRef(false);

  const { mutateAsync: addCart } = useAddToCart();

  const { data: fetchedCartData, isLoading } = useFetchCart(String(user?.id));

  const {
    isOpen,
    setIsOpen,
    initializeCartData,
    toggleCartView,
    setToggleCartView,
    setToggleCheckoutView,
  } = useCartViewStore();

  useEffect(() => {
    if (!isLoggedIn) {
      hasSyncedLocalCart.current = false;
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (
      !isLoggedIn ||
      !user?.id ||
      items.length === 0 ||
      hasSyncedLocalCart.current
    ) {
      return;
    }

    const syncCartToBackend = setTimeout(async () => {
      try {
        const localStorageCart = JSON.parse(
          localStorage.getItem("jebbs-cart-storage") ||
            '{"state":{"items":[]}}'
        );

        const cartItems = (localStorageCart?.state?.items ||
          items) as CartItemProps[];

        if (cartItems.length === 0) return;

        // Backend DTO expects productId, not the product `id` field from local cart.
        const payload = cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          storeId: item.storeId || item.store?.id,
        }));

        const missingStore = payload.some((item) => !item.storeId);
        if (missingStore) {
          console.error("Cannot sync cart: item missing storeId");
          return;
        }

        const serverCart = await addCart({
          cartItems: payload as unknown as CartItemProps[],
          totalPrice: totalAmount,
          userId: user.id,
        });

        hasSyncedLocalCart.current = true;
        queryClient.setQueryData(["cart", user.id], serverCart);
        initializeCartData(
          serverCart as FetchedCartData,
          [],
          true
        );
        localStorage.removeItem("jebbs-cart-storage");
        clearCart();
      } catch (error) {
        console.error("Failed to sync cart to backend:", error);
      }
    }, 1000);

    return () => clearTimeout(syncCartToBackend);
  }, [
    addCart,
    clearCart,
    initializeCartData,
    isLoggedIn,
    items,
    queryClient,
    totalAmount,
    user,
  ]);

  useEffect(() => {
    if (fetchedCartData || items) {
      initializeCartData(fetchedCartData, items, isLoggedIn);
    }
  }, [fetchedCartData, items, isLoggedIn, initializeCartData]);

  // Keep checkout behind login from every entry point (popover, sheet, etc.)
  useEffect(() => {
    if (toggleCartView === "checkout" && !isLoggedIn) {
      setToggleCartView("cart");
      setIsOpen(false);
      onAuthFormOpen();
    }
  }, [
    toggleCartView,
    isLoggedIn,
    setToggleCartView,
    setIsOpen,
    onAuthFormOpen,
  ]);

  return (
    <>
      <AuthModal />
      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) setIsOpen(false);
        }}
      >
        <SheetContent
          side="right"
          className="w-full border-l border-black/10 bg-white p-5 text-ash sm:max-w-[500px]"
        >
          {isLoading && isLoggedIn ? (
            <div className="flex h-full items-center justify-center text-sm text-ash/50">
              Loading checkout…
            </div>
          ) : toggleCartView === "checkout" && isLoggedIn ? (
            <CheckoutPage
              goToCart={() => {
                setToggleCartView("cart");
              }}
            />
          ) : (
            <CartPage
              goToCheckout={() => {
                setToggleCheckoutView("order");
                setToggleCartView("checkout");
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartSheet;
