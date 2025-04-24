import { Cart, Order } from "@/types/types";
import api from "@/utils/api";
import { CartItemProps } from "@/store/cart";
import { useMutation } from "@tanstack/react-query";

interface OrderItemProps {
  storeId: string;
  orderId: string;
  productId: string;
  quantity: number;
}

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (data: {
      orderData: Omit<Order, "id">;
      orderItems: OrderItemProps[];
    }) => {
      const response = await api.post("/orders", data);
      return response.data;
    },
    onSuccess: (data) => {},
    onError: (error) => {
      console.error("Failed to create order", error);
    },
  });
};
