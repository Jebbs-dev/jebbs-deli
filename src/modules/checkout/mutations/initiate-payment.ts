import { Cart, Order } from "@/types/types";
import api from "@/utils/api";
import { CartItemProps } from "@/store/cart";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useOrderData } from "@/store/order";

export interface PaymentProps {
  paymentData: {
    email: string;
    amount: string;
  };
  callback_url: string;
  userId: string;
  orderId: string;
  storeId: string;
}

export const useInitialisePayment = () => {
  const router = useRouter();

  const { setPaymentPayload, setPaymentlinkModalOpen } = useOrderData();

  return useMutation({
    mutationFn: async (data: PaymentProps) => {
      const response = await api.post("/payment/initialise", data);
      return response.data;
    },
    onSuccess: (data) => {
      setPaymentPayload(data.payment);

      setPaymentlinkModalOpen(true);
    },
    onError: (error) => {
      console.error("Failed to initialise payment", error);
    },
  });
};
