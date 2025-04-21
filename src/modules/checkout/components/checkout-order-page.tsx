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

import {
  FetchedCartData,
  StoreTotal,
} from "@/modules/shop/cart/components/cart-sheet";
import { ArrowDown, ArrowLeft, ChevronRight, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutOrderProps {
  proceedToPayment: () => void;
  storeTotals: StoreTotal[];
  typedCartData: FetchedCartData | undefined;
  openStoreId: string | null;
  setIsOpen: (value: boolean) => void;
}

const CheckoutOrderPage = ({
  storeTotals,
  typedCartData,
  openStoreId,
  proceedToPayment,
  setIsOpen
}: CheckoutOrderProps) => {
  const { items, totalAmount, addItem, removeItem } = useCartStore();

  const { isLoggedIn, user } = useAuthStore();

  return (
    <>
      <div className="mb-3 bg-gray-100 py-4 mt-3">
        <p>Order Summary</p>
      </div>
      <div className="flex flex-col h-[80%] justify-between mt-3">
        <div className="overflow-auto h-[85%]">
          {storeTotals
            .filter((store) => openStoreId === store.storeId)
            .map((store) => (
              <div key={store.storeId} className="mb-6">
                <div className="flex flex-col items-start gap-2 mb-2 p-2">
                  <div className="flex flex-row justify-between w-full">
                    <span className="flex flex-row justify-center items-center gap-4">
                      <span>
                        <Image
                          src={String(store.billboard)}
                          alt="billboard"
                          width={100}
                          height={100}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      </span>
                      <span className=" text-orange-700 flex flex-col ">
                        <p className="font-medium">{store.vendorStoreName}</p>

                        <p className="text-sm text-orange-600 border-orange-200">
                          {store.totalQuantity}{" "}
                          {store.totalQuantity === 1 ? "item" : "items"}
                        </p>
                      </span>
                    </span>

                    <p className="flex flex-row items-center text-sm text-orange-600 cursor-pointer">
                      Show selection
                      <ArrowDown className="ml-2" size={18} />{" "}
                    </p>
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
                <div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    {/* <Button asChild> */}
                    <Link
                      href={`/shop/${store.storeId}`}
                      className="flex items-center gap-2 bg-primary text-white rounded-full px-4 py-2"

                      onClick={()=> {
                        setIsOpen(false)
                      }}
                    >
                      <p className="mr-2">+</p>
                      <p>Add Another Pack</p>
                    </Link>
                    {/* </Button> */}
                  </div>
                </div>
              </div>
            ))}

          <div className="border-t py-5 flex flex-row justify-between items-center text-orange-700/70">
            <span className="flex flex-row gap-2 text-orange-700/70">
              <Store />
              <p>Leave a message for the restuarant</p>
            </span>
            <span>
              <ChevronRight />
            </span>
          </div>
        </div>

        <div className="bottom-0 w-full border-t h-auto pt-5 pb-3">
          <p className="mt-0.5 mb-2 text-xs text-gray-500 text-center">
            By proceeding, you agree to our{" "}
            <span className="underline">Terms of Use</span> and{" "}
            <span className="underline">Privacy Policy</span>
          </p>
          <Button
            className="w-full shadow-sm hover:bg-orange-600"
            size="lg"
            onClick={proceedToPayment}
          >
            Make Payment
          </Button>
        </div>
      </div>
    </>
  );
};

export default CheckoutOrderPage;
