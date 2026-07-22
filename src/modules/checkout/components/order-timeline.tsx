import dayjs from "dayjs";
import { cn } from "@/lib/utils";

const ORDER_STEPS = [
  {
    key: "pending",
    title: "Order Received",
    description: "Waiting for the vendor to confirm your order.",
  },
  {
    key: "confirmed",
    title: "Order Confirmed",
    description: "The vendor has confirmed your order.",
  },
  {
    key: "preparing",
    title: "Preparing Your Order",
    description: "Your meal is being prepared.",
  },
  {
    key: "ready",
    title: "Order Ready",
    description: "Your order is ready for pickup or the rider.",
  },
  {
    key: "picked_up",
    title: "On The Way",
    description: "Your order is on its way.",
  },
  {
    key: "delivered",
    title: "Delivered",
    description: "Your order has been delivered. Enjoy!",
  },
] as const;

const STATUS_ALIASES: Record<string, string> = {
  pending: "pending",
  received: "pending",
  confirmed: "confirmed",
  accepted: "confirmed",
  preparing: "preparing",
  preparing_order: "preparing",
  ready: "ready",
  ready_for_pickup: "ready",
  picked_up: "picked_up",
  pickedup: "picked_up",
  in_transit: "picked_up",
  on_the_way: "picked_up",
  delivered: "delivered",
  completed: "delivered",
  cancelled: "cancelled",
  canceled: "cancelled",
};

function normalizeStatus(status?: string | null): string {
  if (!status) return "pending";
  const key = status.trim().toLowerCase().replace(/\s+/g, "_");
  return STATUS_ALIASES[key] ?? key;
}

export interface OrderTimelineProps {
  status?: string | null;
  createdAt?: string | null;
  estimatedDelivery?: string | null;
}

const OrderTimeline = ({
  status,
  createdAt,
  estimatedDelivery,
}: OrderTimelineProps) => {
  const normalized = normalizeStatus(status);
  const isCancelled = normalized === "cancelled";
  const currentIndex = ORDER_STEPS.findIndex((step) => step.key === normalized);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="mx-auto max-w-md p-1">
      <div className="mb-6">
        <p className="text-sm text-ash/50">Order status</p>
        <h2 className="text-xl font-semibold text-ash capitalize">
          {isCancelled ? "Cancelled" : ORDER_STEPS[activeIndex]?.title}
        </h2>
        {estimatedDelivery ? (
          <p className="mt-1 text-sm text-ash/60">{estimatedDelivery}</p>
        ) : createdAt ? (
          <p className="mt-1 text-sm text-ash/60">
            Placed {dayjs(createdAt).format("MMMM D, YYYY h:mm a")}
          </p>
        ) : null}
      </div>

      {isCancelled ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          This order was cancelled.
        </p>
      ) : (
        <div className="space-y-6 border-l-2 border-green-500 pl-4">
          {ORDER_STEPS.map((step, idx) => {
            const isComplete = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const isUpcoming = idx > activeIndex;

            return (
              <div key={step.key} className="relative">
                <div
                  className={cn(
                    "absolute -left-[25px] top-1 h-4 w-4 rounded-full border-2 border-white shadow",
                    isComplete || isCurrent ? "bg-green-500" : "bg-gray-300"
                  )}
                />
                <h3
                  className={cn(
                    "font-medium",
                    isCurrent
                      ? "text-green-700"
                      : isComplete
                        ? "text-ash"
                        : "text-ash/40"
                  )}
                >
                  {step.title}
                </h3>
                <p
                  className={cn(
                    "text-sm",
                    isUpcoming ? "text-ash/35" : "text-ash/60"
                  )}
                >
                  {step.description}
                </p>
                {isCurrent && createdAt && idx === 0 ? (
                  <p className="mt-1 text-sm text-ash/45">
                    {dayjs(createdAt).format("h:mm a")}
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
