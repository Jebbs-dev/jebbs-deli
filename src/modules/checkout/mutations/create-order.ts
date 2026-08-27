import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrderData } from "@/store/order";
import { useInitialisePayment } from "./initiate-payment";
import useAuthStore from "@/store/auth";

export type OrderPaymentMethod = "wallet" | "paystack";
export type FulfillmentType = "delivery" | "pickup";

interface OrderItemProps {
  productId: string;
  quantity: number;
  storeId?: string;
}

export const useCreateOrder = () => {
  const { setOrderData } = useOrderData();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { mutateAsync: initialisePayment } = useInitialisePayment();

  return useMutation({
    mutationFn: async (data: {
      storeId: string;
      fulfillmentType: FulfillmentType;
      vendorAddress: string;
      customerAddress: string;
      orderItems: OrderItemProps[];
      paymentMethod?: OrderPaymentMethod;
    }) => {
      const paymentMethod = data.paymentMethod ?? "paystack";
      const response = await api.post("/v1/orders", {
        storeId: data.storeId,
        fulfillmentType: data.fulfillmentType,
        vendorAddress: data.vendorAddress,
        customerAddress: data.customerAddress,
        orderItems: data.orderItems.map(({ productId, quantity, storeId }) => ({
          productId,
          quantity,
          storeId,
        })),
        paymentMethod,
      });
      return { ...response.data, paymentMethod };
    },
    onSuccess: (data) => {
      setOrderData(data);
      void queryClient.invalidateQueries({ queryKey: ["orders"] });

      if (data.paymentMethod === "wallet") {
        void queryClient.invalidateQueries({ queryKey: ["wallet"] });
        return;
      }

      const orderId = String(data.id);
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";

      void initialisePayment({
        orderId,
        email: String(user?.email ?? ""),
        callback_url: `${origin}/shop/orders/payment/callback`,
      });
    },
    onError: (error) => {
      console.error("Failed to create order", error);
    },
  });
};
