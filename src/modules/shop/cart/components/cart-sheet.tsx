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
import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { useAddToCart } from "@/modules/auth/mutations/add-to-cart";

interface CartProps {
  isOpen: boolean;
  setIsOpen(value: boolean): void;
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

  const { mutateAsync: addCart } = useAddToCart();

  const [showProducts, setShowProducts] = useState(false);

  setTimeout(() => {
    if (isLoggedIn) {
      const localStorageCart = JSON.parse(
        localStorage.getItem("jebbs-cart-storage") || "[]"
      );
      const payload = {
        cartItem: localStorageCart && localStorageCart.state.items.map(
          (
            item: Omit<
              Cart,
              "createdAt" | "updatedAt" | "vendor" | "vendorId" | "id"
            >
          ) => ({
            ...item,
          })
        ), // Ensure quantity is set
        //  // Assuming userInfo contains an id
      };
      addCart(payload.cartItem); // Call the addCart function
      localStorage.removeItem("jebbs-cart-storage"); // Clear local storage cart after moving
    }
    // User is signed in, clear the cart from local storage
  }, 3000);

  // Group products by vendor
  const groupedByVendor = items.reduce((acc, product) => {
    const vendorId = product.vendor?.id || "unknown";
    if (!acc[vendorId]) {
      acc[vendorId] = [];
    }
    acc[vendorId].push(product);
    return acc;
  }, {} as Record<string, CartItemProps[]>);

  // Calculate totals for each vendor
  const vendorTotals = Object.entries(groupedByVendor).map(
    ([vendorId, products]) => ({
      vendorId,
      vendorName: products[0].vendor?.name || "Unknown Vendor",
      totalQuantity: products.reduce(
        (sum, product) => sum + product.quantity,
        0
      ),
      totalAmount: products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      ),
      products,
    })
  );

  return (
    <>
      <Sheet
        open={isOpen}
        onOpenChange={() => {
          setIsOpen(false);
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-[500px]">
          <SheetHeader className="mb-4">
            <SheetTitle>My Cart</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col justify-between h-full mb-3">
            <div className="overflow-auto">
              {vendorTotals.map((vendor) => (
                <div
                  key={vendor.vendorId}
                  className="mb-6 border border-gray-200 p-6 rounded-xl"
                >
                  <div className="flex flex-col items-start gap-2 mb-2 bg-orange-50 p-2 rounded-md">
                    <div className="flex flex-row justify-between w-full">
                      <h3 className="font-medium text-orange-700">
                        {vendor.vendorName}
                      </h3>

                      <p
                        className="flex flex-row items-center text-sm text-orange-600"
                        onClick={() => setShowProducts(!showProducts)}
                      >
                        Show selection
                        <ArrowDown className="ml-2" size={18} />{" "}
                      </p>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="text-sm text-orange-600">
                        ₦
                        {formatNumberWithCommas(
                          Number(vendor.totalAmount.toFixed(2))
                        )}
                      </span>
                      <span className="text-sm text-orange-600 border-l pl-4 border-orange-200">
                        {vendor.totalQuantity}{" "}
                        {vendor.totalQuantity === 1 ? "item" : "items"}
                      </span>
                    </div>
                  </div>
                  {showProducts && (
                    <ul className="divide-y divide-gray-200 transition">
                      {vendor.products.map((item: CartItemProps) => (
                        <CartItem
                          key={item.id}
                          items={{
                            ...item,
                            onRemove: () => removeItem(item.id),
                            onAdd: () => addItem(item),
                          }}
                        />
                      ))}
                    </ul>
                  )}
                  <div className="mt-4 flex flex-col gap-4">
                    <Link
                      href={isLoggedIn ? `/checkout` : "/auth"}
                      className="flex items-center justify-center rounded-md border border-transparent bg-orange-400 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-orange-600"
                    >
                      Proceed to checkout
                    </Link>
                    <Button
                      className="w-full bg-red-100 px-6 py-3 text-red-500 text-sm hover:bg-red-200"
                      onClick={() => clearVendorItems(vendor.vendorId)}
                    >
                      Clear {vendor.vendorName}'s Items
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bottom-0 w-full border-t border-gray-200 px-4 pb-6 sm:px-6 mt-4">
              <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
                <p>Total Amount</p>
                <p>₦{formatNumberWithCommas(Number(totalAmount.toFixed(2)))}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="my-6">
                {/* <Link
                  href={isLoggedIn ? `/checkout` : "/auth"}
                  className="flex items-center justify-center rounded-md border border-transparent bg-orange-400 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-orange-600"
                >
                  Proceed to checkout
                </Link> */}
                {items.length > 0 && (
                  <Button
                    className="mt-3 w-full bg-red-200 px-6 py-3 text-red-500 text-sm hover:bg-red-300"
                    onClick={clearCart}
                  >
                    Clear All Items
                  </Button>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartSheet;
