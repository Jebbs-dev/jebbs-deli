import { Order } from "@/types/types";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrderData } from "@/store/order";
import { useInitialisePayment } from "./initiate-payment";
import useAuthStore from "@/store/auth";

export type OrderPaymentMethod = "wallet" | "paystack";

interface OrderItemProps {
  storeId: string;
  orderId: string;
  productId: string;
  quantity: number;
}

export const useCreateOrder = () => {
  const { setOrderData } = useOrderData();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { mutateAsync: initialisePayment } = useInitialisePayment();

  return useMutation({
    mutationFn: async (data: {
      orderData: Omit<Order, "id">;
      orderItems: OrderItemProps[];
      paymentMethod?: OrderPaymentMethod;
    }) => {
      const paymentMethod = data.paymentMethod ?? "paystack";
      const response = await api.post("/orders", {
        orderData: {
          ...data.orderData,
          paymentMethod,
        },
        orderItems: data.orderItems,
        paymentMethod,
      });
      return { ...response.data, paymentMethod };
    },
    onSuccess: (data) => {
      setOrderData(data);

      if (data.paymentMethod === "wallet") {
        void queryClient.invalidateQueries({ queryKey: ["wallet"] });
        return;
      }

      setTimeout(() => {
        void initialisePayment({
          paymentData: {
            email: String(user?.email),
            amount: String(data.order.totalPrice * 100),
          },
          callback_url:
            typeof window !== "undefined"
              ? `${window.location.origin}/shop`
              : "http://localhost:3000/shop",
          userId: String(user?.id),
          orderId: String(data?.order.id),
          storeId: data?.order.storeId,
        });
      }, 500);
    },
    onError: (error) => {
      console.error("Failed to create order", error);
    },
  });
};
