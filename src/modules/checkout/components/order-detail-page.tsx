import { Link, useParams } from "@tanstack/react-router";
import { FaSpinner } from "react-icons/fa6";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import OrderTimeline from "@/modules/checkout/components/order-timeline";
import PaymentLinkModal from "@/modules/checkout/components/payment-link-modal";
import { useFetchOrderById } from "@/modules/checkout/queries/fetch-order-by-userId";
import { useInitialisePayment } from "@/modules/checkout/mutations/initiate-payment";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import useAuthStore from "@/store/auth";
import { useToast } from "@/hooks/use-toast";

const UNPAID_PAYMENT = new Set(["pending", "failed", "abandoned"]);

export function OrderDetailPage() {
  const { orderId } = useParams({ from: "/shop/orders/$orderId" });
  const { data: order, isLoading, isError, error } = useFetchOrderById(orderId);
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { mutateAsync: initialisePayment, isPending: payingAgain } =
    useInitialisePayment();

  const payment = order?.payments?.[0];
  const rider = order?.assignment?.rider;
  const canPayAgain =
    order?.status === "pending" &&
    (!payment || UNPAID_PAYMENT.has(String(payment.status).toLowerCase()));

  const handlePayAgain = async () => {
    if (!orderId) return;
    try {
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";
      await initialisePayment({
        orderId: String(orderId),
        email: String(user?.email ?? ""),
        callback_url: `${origin}/shop/orders/payment/callback`,
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } }; message?: string })
          ?.response?.data?.message ||
        (err as Error)?.message ||
        "Could not start payment";
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: message,
      });
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-ash/50">Order</p>
          <h1 className="text-2xl font-semibold text-ash">
            #{orderId?.slice(0, 8)}
          </h1>
        </div>
        <Button asChild variant="outline" className="rounded-lg">
          <Link to="/shop">Back to shop</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <FaSpinner className="size-6 animate-spin text-scotch" />
        </div>
      ) : isError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {(error as Error)?.message || "Could not load this order."}
        </p>
      ) : !order ? (
        <p className="text-sm text-ash/60">Order not found.</p>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-black/10 bg-white p-5">
            <div className="flex flex-wrap gap-4 text-sm text-ash/70">
              <p>
                <span className="text-ash/45">Store: </span>
                {order.store?.name}
              </p>
              <p className="capitalize">
                <span className="text-ash/45">Type: </span>
                {order.fulfillmentType}
              </p>
              <p>
                <span className="text-ash/45">Total: </span>₦
                {formatNumberWithCommas(Number(Number(order.totalPrice).toFixed(2)))}
              </p>
              {order.createdAt ? (
                <p>
                  <span className="text-ash/45">Placed: </span>
                  {dayjs(order.createdAt).format("MMM D, h:mm a")}
                </p>
              ) : null}
            </div>
            <ul className="mt-4 space-y-2 border-t border-black/5 pt-4 text-sm">
              {(order.orderItems ?? []).map(
                (item: {
                  id: string;
                  productName: string;
                  quantity: number;
                  unitPrice: number | string;
                }) => (
                  <li key={item.id} className="flex justify-between text-ash">
                    <span>
                      {item.quantity}× {item.productName}
                    </span>
                    <span>
                      ₦
                      {formatNumberWithCommas(
                        Number(
                          (Number(item.unitPrice) * item.quantity).toFixed(2),
                        ),
                      )}
                    </span>
                  </li>
                ),
              )}
            </ul>

            {canPayAgain ? (
              <div className="mt-4 border-t border-black/5 pt-4">
                <Button
                  className="w-full rounded-lg bg-scotch text-ash hover:brightness-110"
                  disabled={payingAgain}
                  onClick={() => void handlePayAgain()}
                >
                  {payingAgain ? (
                    <>
                      Starting payment
                      <FaSpinner className="ml-2 animate-spin" />
                    </>
                  ) : (
                    "Pay again"
                  )}
                </Button>
              </div>
            ) : null}
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-5">
            <OrderTimeline
              status={order.status}
              fulfillmentType={order.fulfillmentType}
              createdAt={order.createdAt}
              statusEvents={order.statusEvents}
              paymentStatus={payment?.status}
              rider={rider}
            />
          </div>
        </div>
      )}

      <PaymentLinkModal />
    </div>
  );
}
