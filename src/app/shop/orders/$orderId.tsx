import { createFileRoute } from "@tanstack/react-router";
import { OrderDetailPage } from "@/modules/checkout/components/order-detail-page";

export const Route = createFileRoute("/shop/orders/$orderId")({
  component: OrderDetailPage,
});
