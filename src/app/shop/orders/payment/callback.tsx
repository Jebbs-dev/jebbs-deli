import { createFileRoute } from "@tanstack/react-router";
import { OrderPaymentCallbackPage } from "@/modules/checkout/components/order-payment-callback-page";

type PaymentCallbackSearch = {
  reference?: string;
};

export const Route = createFileRoute("/shop/orders/payment/callback")({
  validateSearch: (search: Record<string, unknown>): PaymentCallbackSearch => ({
    reference:
      typeof search.reference === "string" && search.reference.length > 0
        ? search.reference
        : typeof search.trxref === "string" && search.trxref.length > 0
          ? search.trxref
          : undefined,
  }),
  component: OrderPaymentCallbackPage,
});
