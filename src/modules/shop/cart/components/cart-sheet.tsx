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

const CartSheet = ({ isOpen, setIsOpen }: CartProps) => {
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

  const { data: fetchedCartData, isLoading } = useFetchCart(
    user?.id ? String(user.id) : ""
  );
  const typedCartData = fetchedCartData as FetchedCartData | undefined;

  const [toggleCartView, setToggleCartView] = useState<"cart" | "checkout">(
    "cart"
  );

  const [openStoreId, setOpenStoreId] = useState<string | null>(null);


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

  // Fetch the products from the fetchedCartData and transform them
  const fetchedCartItems: CartItemProps[] =
    typedCartData?.cartGroups?.flatMap((group) =>
      group.cartItems.map((item) => {
        // Extract the basic store fields from the group
        const store = {
          ...group.store,
          // Add default values for required Vendor fields that might be missing
          email: "",
          telephone: "",
          address: "",
          logo: "",
          isActive: true,
          slug: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Cast to any first to avoid TypeScript issues with property assignments
        return {
          ...item.product, // Spread product details
          quantity: item.quantity, // Add quantity
          store, // Add properly typed store
          storeId: group.storeId, // Add storeId
          cartId: typedCartData.id, // Add cartId for backend operations
        } as unknown as CartItemProps;
      })
    ) ?? [];

  // Group products by vendor - use backend data for logged in users, local data otherwise
  const cartItemsToUse = isLoggedIn ? fetchedCartItems : items;

  const groupedByVendorStore = cartItemsToUse.reduce<
    Record<string, CartItemProps[]>
  >((acc, product) => {
    const storeId = product.store?.id || "unknown";
    if (!acc[storeId]) {
      acc[storeId] = [];
    }
    acc[storeId].push(product);
    return acc;
  }, {});

  // Calculate totals for each vendor
  const storeTotals: StoreTotal[] = Object.entries(groupedByVendorStore).map(
    ([storeId, products]) => ({
      storeId,
      vendorStoreName: products[0]?.store?.name || "Unknown Vendor",
      totalQuantity: products.reduce(
        (sum: number, product) => sum + product.quantity,
        0
      ),
      totalAmount: products.reduce(
        (sum: number, product) => sum + product.price * product.quantity,
        0
      ),
      billboard: products[0]?.store?.billboard,
      products,
    })
  );

  // Calculate the overall cart total (handles both local and backend cart)
  const cartTotal = storeTotals.reduce(
    (sum, store) => sum + store.totalAmount,
    0
  );

  // Handle removing all items from a vendor
  const handleClearVendorItems = async (storeId: string) => {
    if (isLoggedIn && user?.id && typedCartData?.id) {
      try {
        console.log("Clearing vendor items for store:", storeId);

        // Filter out the entire cart group for this vendor
        const remainingGroups = typedCartData.cartGroups.filter(
          (group) => group.storeId !== storeId
        );

        // Get all items from the remaining groups
        const allCartItems = remainingGroups.flatMap((group) =>
          group.cartItems.map((item) => ({
            id: item.product.id,
            productId: item.product.id,
            quantity: item.quantity,
            storeId: group.storeId,
          }))
        );

        console.log("Remaining groups after removal:", remainingGroups.length);
        console.log("Remaining items after removal:", allCartItems);

        // Calculate new total price
        const newTotalPrice = allCartItems.reduce((sum, item) => {
          // Find the original product to get the price
          const product = typedCartData.cartGroups
            .flatMap((g) => g.cartItems)
            .find((ci) => ci.product.id === item.id)?.product;

          return sum + (product?.price || 0) * item.quantity;
        }, 0);

        // Update the cart with only the remaining items
        const result = await updateCart({
          cartId: typedCartData.id,
          userId: user.id,
          cartItems: allCartItems,
          totalPrice: newTotalPrice,
        });

        console.log("Clear vendor result:", result);
      } catch (error) {
        console.error("Failed to clear vendor items:", error);
      }
    } else {
      // Use local cart store function
      clearVendorItems(storeId);
    }
  };

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
              handleClearVendorItems={handleClearVendorItems}
              storeTotals={storeTotals}
              typedCartData={typedCartData}
              cartTotal={cartTotal}
              cartItemsToUse={cartItemsToUse}
              openStoreId={openStoreId}
              setOpenStoreId={setOpenStoreId}
            />
          ) : (
            <CheckoutPage
              goToCart={() => {
                setToggleCartView("cart");
              }}
              storeTotals={storeTotals}
              typedCartData={typedCartData}
              openStoreId={openStoreId}
              setIsOpen={setIsOpen}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartSheet;
