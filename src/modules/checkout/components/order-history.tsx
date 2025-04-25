import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useAuthStore from "@/store/auth";
import { useCartViewStore } from "@/store/cart-data";
import React from "react";
import { useFetchOrders } from "../queries/fetch-order-by-userId";
import { useSheetStore } from "@/store/use-sheet";
import dayjs from "dayjs";

const OrderHistory = () => {
  const { isOrderHistoryOpen, setIsOrderHistoryOpen } = useCartViewStore();
  const { isOpen, open, close } = useSheetStore();

  const { isLoggedIn, user } = useAuthStore();

  const { data: orderData, isLoading: isOrderLoading } = useFetchOrders(
    String(user?.id)
  );

  if (isOrderLoading) {
    return <div>Loading...</div>;
  }

  return (
    // <div>

    // </div>
    <Sheet
      open={isOrderHistoryOpen}
      onOpenChange={() => {
        setIsOrderHistoryOpen(false);
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-[500px]">
        <SheetHeader className="mb-4">
          <SheetTitle className="border-b pb-1">Orders</SheetTitle>
        </SheetHeader>
          <div className="mt-5">
            {!isOrderLoading &&
              orderData?.map((data: any) => (
                <div className="flex flex-row cursor-pointer">
                  <div className="w-[80%] flex flex-col gap-1">
                    {data.orderItems.map((items: any) => (
                      <p className="font-medium">{items.store.name}</p>
                    ))}
                    <p className="text-black text-opacity-50">{dayjs(data.createdAt).format("MMMM D, YYYY h:mm a")}</p>
                  </div>
                  <div className="flex flex-col">
                    <p>Order #{1}</p>
                    <p className="text-green-600 text-sm">View Timeline</p>
                  </div>
                </div>
              ))}
          </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderHistory;
