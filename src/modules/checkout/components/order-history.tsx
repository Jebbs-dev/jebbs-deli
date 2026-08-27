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
import { Link } from "@tanstack/react-router";

type OrderItem = {
  id: string;
  store?: { name?: string };
};

type OrderRecord = {
  id: string;
  status?: string;
  fulfillmentType?: string;
  createdAt?: string;
  totalPrice?: number | string;
  orderItems?: OrderItem[];
  payments?: Array<{ status?: string }>;
  statusEvents?: Array<{ status: string; at: string; note?: string | null }>;
  assignment?: {
    rider?: { name?: string | null; telephone?: string | null };
  } | null;
  store?: { name?: string };
};

const OrderHistory = () => {
  const { isOrderHistoryOpen, setIsOrderHistoryOpen } = useCartViewStore();
  const { user } = useAuthStore();
  const { data: orderData, isLoading: isOrderLoading } = useFetchOrders(
    String(user?.id),
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const orders: OrderRecord[] = orderData?.items ?? [];

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
                  data.store?.name ??
                  data.orderItems?.find((item) => item.store?.name)?.store
                    ?.name ??
                  "Order";
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
                      {data.totalPrice != null ? (
                        <p className="text-sm text-ash/60">
                          ₦
                          {formatNumberWithCommas(
                            Number(data.totalPrice),
                          )}
                        </p>
                      ) : null}
                      <p className="text-xs capitalize text-ash/45">
                        {data.fulfillmentType ?? "delivery"} · {data.status}
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-ash/40">#{shortId}</div>
                  </button>
                );
              })
            )}
          </div>

          {selectedOrder ? (
            <div className="mt-8 border-t pt-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-ash">Tracking</p>
                <Link
                  to="/shop/orders/$orderId"
                  params={{ orderId: selectedOrder.id }}
                  className="text-sm text-scotch underline"
                  onClick={() => setIsOrderHistoryOpen(false)}
                >
                  Open details
                </Link>
              </div>
              <OrderTimeline
                status={selectedOrder.status}
                fulfillmentType={selectedOrder.fulfillmentType}
                createdAt={selectedOrder.createdAt}
                statusEvents={selectedOrder.statusEvents}
                paymentStatus={selectedOrder.payments?.[0]?.status}
                rider={selectedOrder.assignment?.rider}
              />
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default OrderHistory;
