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

interface CartProps {
  isOpen: boolean;
  setIsOpen(value: boolean): void;
}

interface StoreTotal {
  storeId: string;
  vendorStoreName: string;
  totalQuantity: number;
  totalAmount: number;
  products: CartItemProps[];
}

interface CartStoreGroup {
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

interface FetchedCartData {
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

  const { data: fetchedCartData, isLoading } = useFetchCart(user?.id ? String(user.id) : "");
  const typedCartData = fetchedCartData as FetchedCartData | undefined;

  const [showProducts, setShowProducts] = useState(false);
  const [openStoreId, setOpenStoreId] = useState<string | null>(null);

  // Effect to sync local cart to backend when user logs in
  useEffect(() => {
    if (isLoggedIn && user?.id && items.length > 0) {
      // Small delay to ensure auth is fully complete
      const syncCartToBackend = setTimeout(async () => {
        try {
          const localStorageCart = JSON.parse(
            localStorage.getItem("jebbs-cart-storage") || "{\"state\":{\"items\":[]}}"
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
  const fetchedCartItems: CartItemProps[] = typedCartData?.cartGroups?.flatMap((group) =>
    group.cartItems.map((item) => {
      // Extract the basic store fields from the group
      const store = {
        ...group.store,
        // Add default values for required Vendor fields that might be missing
        email: '',
        telephone: '',
        address: '',
        logo: '',
        isActive: true,
        slug: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Cast to any first to avoid TypeScript issues with property assignments
      return {
        ...item.product,          // Spread product details
        quantity: item.quantity,  // Add quantity
        store,                   // Add properly typed store
        storeId: group.storeId,   // Add storeId
        cartId: typedCartData.id  // Add cartId for backend operations
      } as unknown as CartItemProps;
    })
  ) ?? [];

  // Group products by vendor - use backend data for logged in users, local data otherwise
  const cartItemsToUse = isLoggedIn ? fetchedCartItems : items;
  
  const groupedByVendorStore = cartItemsToUse.reduce<Record<string, CartItemProps[]>>((acc, product) => {
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
      products,
    })
  );

  // Calculate the overall cart total (handles both local and backend cart)
  const cartTotal = storeTotals.reduce((sum, store) => sum + store.totalAmount, 0);

  // Handle removing all items from a vendor
  const handleClearVendorItems = async (storeId: string) => {
    if (isLoggedIn && user?.id && typedCartData?.id) {
      try {
        console.log("Clearing vendor items for store:", storeId);
        
        // Filter out the entire cart group for this vendor
        const remainingGroups = typedCartData.cartGroups.filter(group => group.storeId !== storeId);
        
        // Get all items from the remaining groups
        const allCartItems = remainingGroups.flatMap(group => 
          group.cartItems.map(item => ({
            id: item.product.id,
            productId: item.product.id,
            quantity: item.quantity,
            storeId: group.storeId
          }))
        );
        
        console.log("Remaining groups after removal:", remainingGroups.length);
        console.log("Remaining items after removal:", allCartItems);
        
        // Calculate new total price
        const newTotalPrice = allCartItems.reduce(
          (sum, item) => {
            // Find the original product to get the price
            const product = typedCartData.cartGroups
              .flatMap(g => g.cartItems)
              .find(ci => ci.product.id === item.id)?.product;
            
            return sum + (product?.price || 0) * item.quantity;
          }, 
          0
        );
        
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
                          setOpenStoreId(openStoreId === store.storeId ? null : store.storeId)
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
                            cartId: isLoggedIn ? typedCartData?.id : undefined
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
                        }
                      }}
                    >
                      <Link
                        href={isLoggedIn ? `/checkout` : "/shop"}
                        className="flex items-center justify-center rounded-md border border-transparent bg-orange-400 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-orange-600"
                      >
                        Proceed to checkout
                      </Link>
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
              <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
                <p>Total Amount</p>
                <p>₦{formatNumberWithCommas(Number(cartTotal.toFixed(2)))}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="my-6">
                <Link
                  href={isLoggedIn ? `/checkout` : ""}
                  className="flex items-center justify-center rounded-md border border-transparent bg-orange-400 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-orange-600"
                  onClick={() => {
                    if (!isLoggedIn) {
                      onAuthFormOpen();
                    }
                  }}
                >
                  Proceed to checkout
                </Link>
                {cartItemsToUse.length > 0 && (
                  <Button
                    className="mt-3 w-full bg-red-200 px-6 py-3 text-red-500 text-sm hover:bg-red-300"
                    onClick={async () => {
                      if (isLoggedIn && user?.id && typedCartData?.id) {
                        try {
                          console.log("Clearing all items from cart - removing all cart groups");
                          
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
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartSheet;
