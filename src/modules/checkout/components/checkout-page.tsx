import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Cart, Product } from "@/types/types";
import Image from "next/image";
import useCartStore, { CartItemProps } from "@/store/cart";
import CartItem from "@/modules/shop/cart/components/cart-item";
import Link from "next/link";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import useAuthStore from "@/store/auth";
import { useState } from "react";
import {
  useUpdateCart,
  useRemoveFromCart,
} from "@/modules/shop/cart/mutations/update-cart";
import { useAddToCart } from "@/modules/shop/cart/mutations/add-to-cart";
import { useAuthFormModal } from "@/store/auth-form-modal";
import { useFetchCart } from "@/modules/shop/cart/queries/fetch-cart";
import {
  FetchedCartData,
  StoreTotal,
} from "@/modules/shop/cart/components/cart-sheet";
import { ArrowDown, ArrowLeft, ChevronRight, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckoutOrderPage from "./checkout-order-page";
import PaymentPage from "./payment-page";
import { useCartViewStore } from "@/store/cart-data";

interface ChekoutProps {
  goToCart: () => void;
}

const CheckoutPage = ({ goToCart }: ChekoutProps) => {
    const {
      toggleCheckoutView,
      setToggleCheckoutView
    } = useCartViewStore();


  return (
    <>
      <SheetHeader>
        <div className="flex flex-row items-center">
          <span className="mr-1">
            <ArrowLeft onClick={goToCart} size={17} />
          </span>
          <span>
            <h3 className="text-2xl">Checkout</h3>
          </span>
        </div>

        <div className="flex flex-row gap-3 pt-2">
          <span
            className="w-1/2 flex flex-col gap-2"
            onClick={() => {
              setToggleCheckoutView("order");
            }}
          >
            <p>Your order</p>
            <div className={`w-full rounded-lg h-2.5 bg-primary`}></div>
          </span>

          <span
            className="w-1/2 flex flex-col gap-2"
            onClick={() => {
              setToggleCheckoutView("payment");
            }}
          >
            Delivery & Payment
            <div
              className={`w-full rounded-lg h-2.5 ${
                toggleCheckoutView === "payment" ? "bg-primary" : "bg-gray-100"
              }`}
            ></div>
          </span>
        </div>
      </SheetHeader>
      {toggleCheckoutView === "order" ? (
        <CheckoutOrderPage
          proceedToPayment={() => {
            setToggleCheckoutView("payment");
          }}
          // storeTotals={storeTotals}
          // typedCartData={typedCartData}
          // openStoreId={openStoreId}
          // setIsOpen={setIsOpen}
        />
      ) : (
        <PaymentPage />
      )}
    </>
  );
};

export default CheckoutPage;
