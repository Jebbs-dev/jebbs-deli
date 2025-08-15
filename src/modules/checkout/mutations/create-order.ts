import { Cart, Order } from "@/types/types";
import api from "@/utils/api";
import { CartItemProps } from "@/store/cart";
import { useMutation } from "@tanstack/react-query";
import { useOrderData } from "@/store/order";
import { useInitialisePayment } from "./initiate-payment";
import useAuthStore from "@/store/auth";

interface OrderItemProps {
  storeId: string;
  orderId: string;
  productId: string;
  quantity: number;
}

export const useCreateOrder = () => {
  const { setOrderData, setPaymentlinkModalOpen } = useOrderData();
  const { user } = useAuthStore();

  const {
    mutateAsync: initialisePayment,
    isPending: isPaymentInitialisationPending,
  } = useInitialisePayment();

  return useMutation({
    mutationFn: async (data: {
      orderData: Omit<Order, "id">;
      orderItems: OrderItemProps[];
    }) => {
      const response = await api.post("/orders", data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);

      setOrderData(data);

      setTimeout(() => {
        initialisePayment({
          paymentData: {
            email: String(user?.email),
            amount: String(data.order.totalPrice * 100),
          },
          callback_url: "http://localhost:3000/shop",
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
