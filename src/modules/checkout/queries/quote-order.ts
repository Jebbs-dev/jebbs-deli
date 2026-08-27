import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import type { FulfillmentType } from "../mutations/create-order";

export type OrderQuote = {
  storeId: string;
  fulfillmentType: FulfillmentType;
  subTotal: number;
  serviceFee: number;
  deliveryFee: number;
  bagFee: number;
  surgeFee: number;
  totalPrice: number;
};

type QuoteInput = {
  storeId: string;
  fulfillmentType: FulfillmentType;
  orderItems: Array<{ productId: string; quantity: number }>;
  enabled?: boolean;
};

export const useOrderQuote = ({
  storeId,
  fulfillmentType,
  orderItems,
  enabled = true,
}: QuoteInput) => {
  const itemsKey = orderItems
    .map((item) => `${item.productId}:${item.quantity}`)
    .join(",");

  return useQuery({
    queryKey: ["order-quote", storeId, fulfillmentType, itemsKey],
    queryFn: async (): Promise<OrderQuote> => {
      const response = await api.post("/v1/orders/quote", {
        storeId,
        fulfillmentType,
        orderItems: orderItems.map(({ productId, quantity }) => ({
          productId,
          quantity,
        })),
      });
      return response.data;
    },
    enabled: enabled && !!storeId && orderItems.length > 0,
    staleTime: 15_000,
  });
};
