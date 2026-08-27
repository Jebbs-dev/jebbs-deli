import dayjs from "dayjs";
import { cn } from "@/lib/utils";

type FulfillmentType = "delivery" | "pickup";

const DELIVERY_STEPS = [
  { key: "pending", title: "Order Placed", description: "Waiting for payment confirmation." },
  { key: "paid", title: "Payment Confirmed", description: "Payment received. Waiting for the vendor." },
  { key: "confirmed", title: "Order Confirmed", description: "The vendor has confirmed your order." },
  { key: "preparing", title: "Preparing", description: "Your meal is being prepared." },
  { key: "ready", title: "Ready", description: "Ready for the rider to pick up." },
  { key: "picked_up", title: "Picked Up", description: "Rider has collected your order." },
  { key: "in_transit", title: "On The Way", description: "Your order is on its way." },
  { key: "delivered", title: "Delivered", description: "Enjoy your meal!" },
] as const;

const PICKUP_STEPS = [
  { key: "pending", title: "Order Placed", description: "Waiting for payment confirmation." },
  { key: "paid", title: "Payment Confirmed", description: "Payment received. Waiting for the vendor." },
  { key: "confirmed", title: "Order Confirmed", description: "The vendor has confirmed your order." },
  { key: "preparing", title: "Preparing", description: "Your meal is being prepared." },
  { key: "ready", title: "Ready for Pickup", description: "Your order is ready at the store." },
  { key: "delivered", title: "Picked Up", description: "You have collected your order." },
] as const;

export interface StatusEvent {
  status: string;
  at: string;
  note?: string | null;
}

export interface RiderInfo {
  name?: string | null;
  telephone?: string | null;
}

export interface OrderTimelineProps {
  status?: string | null;
  fulfillmentType?: FulfillmentType | string | null;
  createdAt?: string | null;
  statusEvents?: StatusEvent[];
  paymentStatus?: string | null;
  rider?: RiderInfo | null;
  isLoading?: boolean;
}

function stepsFor(fulfillmentType?: string | null) {
  return fulfillmentType === "pickup" ? PICKUP_STEPS : DELIVERY_STEPS;
}

function eventTime(events: StatusEvent[] | undefined, key: string) {
  return events?.find((e) => e.status === key)?.at;
}

const OrderTimeline = ({
  status,
  fulfillmentType = "delivery",
  createdAt,
  statusEvents,
  paymentStatus,
  rider,
  isLoading,
}: OrderTimelineProps) => {
  if (isLoading) {
    return (
      <div className="mx-auto max-w-md space-y-3 p-1">
        <div className="h-6 w-40 animate-pulse rounded bg-ash/10" />
        <div className="h-24 animate-pulse rounded bg-ash/5" />
      </div>
    );
  }

  const normalized = (status || "pending").toLowerCase();
  const isCancelled = normalized === "cancelled";
  const isFailed = normalized === "failed";
  const steps = stepsFor(fulfillmentType);
  const currentIndex = steps.findIndex((step) => step.key === normalized);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="mx-auto max-w-md p-1">
      <div className="mb-4">
        <p className="text-sm text-ash/50">Order status</p>
        <h2 className="text-xl font-semibold capitalize text-ash">
          {isCancelled
            ? "Cancelled"
            : isFailed
              ? "Delivery failed"
              : steps[activeIndex]?.title}
        </h2>
        {createdAt ? (
          <p className="mt-1 text-sm text-ash/60">
            Placed {dayjs(createdAt).format("MMMM D, YYYY h:mm a")}
          </p>
        ) : null}
        {paymentStatus ? (
          <p
            className={cn(
              "mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
              paymentStatus === "success"
                ? "bg-green-100 text-green-800"
                : paymentStatus === "failed" || paymentStatus === "abandoned"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-800",
            )}
          >
            Payment: {paymentStatus}
          </p>
        ) : null}
      </div>

      {rider?.name ? (
        <div className="mb-4 rounded-lg border border-black/10 bg-cream/40 px-3 py-2 text-sm">
          <p className="font-medium text-ash">Rider: {rider.name}</p>
          {rider.telephone ? (
            <a
              className="text-scotch underline"
              href={`tel:${rider.telephone}`}
            >
              {rider.telephone}
            </a>
          ) : null}
        </div>
      ) : null}

      {isCancelled || isFailed ? (
        <p
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            isFailed ? "bg-amber-50 text-amber-800" : "bg-red-50 text-red-600",
          )}
        >
          {isFailed
            ? "Delivery could not be completed. Contact support if you need a refund."
            : "This order was cancelled."}
        </p>
      ) : (
        <div className="space-y-6 border-l-2 border-green-500 pl-4">
          {steps.map((step, idx) => {
            const isComplete = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const isUpcoming = idx > activeIndex;
            const at = eventTime(statusEvents, step.key);

            return (
              <div key={step.key} className="relative">
                <div
                  className={cn(
                    "absolute -left-[25px] top-1 h-4 w-4 rounded-full border-2 border-white shadow",
                    isComplete || isCurrent ? "bg-green-500" : "bg-gray-300",
                  )}
                />
                <h3
                  className={cn(
                    "font-medium",
                    isCurrent
                      ? "text-green-700"
                      : isComplete
                        ? "text-ash"
                        : "text-ash/40",
                  )}
                >
                  {step.title}
                </h3>
                <p
                  className={cn(
                    "text-sm",
                    isUpcoming ? "text-ash/35" : "text-ash/60",
                  )}
                >
                  {step.description}
                </p>
                {(isComplete || isCurrent) && at ? (
                  <p className="mt-1 text-sm text-ash/45">
                    {dayjs(at).format("h:mm a")}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
