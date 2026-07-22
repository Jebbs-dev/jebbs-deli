import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useAuthStore from "@/store/auth";
import { useCartViewStore } from "@/store/cart-data";
import { useState } from "react";
import { useFetchOrders } from "../queries/fetch-order-by-userId";
import dayjs from "dayjs";
import OrderTimeline from "./order-timeline";
import { formatNumberWithCommas } from "@/utils/formatNumber";

type OrderItem = {
  id: string;
  store?: { name?: string };
};

type OrderRecord = {
  id: string;
  status?: string;
  createdAt?: string;
  totalPrice?: number;
  orderItems?: OrderItem[];
};

const OrderHistory = () => {
  const { isOrderHistoryOpen, setIsOrderHistoryOpen } = useCartViewStore();
  const { user } = useAuthStore();
  const { data: orderData, isLoading: isOrderLoading } = useFetchOrders(
    String(user?.id)
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const orders: OrderRecord[] = orderData?.orders ?? [];

  return (
    <>
      <Sheet
        open={isOrderHistoryOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsOrderHistoryOpen(false);
            setSelectedOrder(null);
          }
        }}
      >
        <SheetContent side="right" className="w-full bg-white sm:max-w-[500px]">
          <SheetHeader className="mb-4">
            <SheetTitle className="border-b pb-1 text-ash">Orders</SheetTitle>
          </SheetHeader>
          <div className="mt-5 space-y-4">
            {isOrderLoading ? (
              <p className="text-sm text-ash/60">Loading orders…</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-ash/60">No orders yet.</p>
            ) : (
              orders.map((data) => {
                const storeName =
                  data.orderItems?.find((item) => item.store?.name)?.store
                    ?.name ?? "Order";
                const shortId = data.id?.slice(0, 8) ?? "—";

                return (
                  <button
                    type="button"
                    className="flex w-full cursor-pointer flex-row text-left"
                    key={data.id}
                    onClick={() => setSelectedOrder(data)}
                  >
                    <div className="flex w-[70%] flex-col gap-1">
                      <p className="font-medium text-ash">{storeName}</p>
                      {data.createdAt ? (
                        <p className="text-sm text-ash/50">
                          {dayjs(data.createdAt).format("MMMM D, YYYY h:mm a")}
                        </p>
                      ) : null}
                      {typeof data.totalPrice === "number" ? (
                        <p className="text-sm text-ash/60">
                          ₦
                          {formatNumberWithCommas(
                            Number(data.totalPrice.toFixed(2))
                          )}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm text-ash">Order #{shortId}</p>
                      <p className="text-sm text-green-600">View Timeline</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
      >
        <SheetContent side="right" className="w-full bg-white sm:max-w-[500px]">
          <SheetHeader className="mb-4">
            <SheetTitle className="border-b pb-1 text-ash">
              Order #{selectedOrder?.id?.slice(0, 8) ?? "—"}
            </SheetTitle>
          </SheetHeader>
          {selectedOrder ? (
            <OrderTimeline
              status={selectedOrder.status}
              createdAt={selectedOrder.createdAt}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default OrderHistory;
