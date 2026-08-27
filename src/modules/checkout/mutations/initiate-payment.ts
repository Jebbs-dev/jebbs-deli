import api from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useOrderData } from "@/store/order";

export interface PaymentProps {
  orderId: string;
  email: string;
  callback_url: string;
}

export const useInitialisePayment = () => {
  const { setPaymentPayload, setPaymentlinkModalOpen } = useOrderData();

  return useMutation({
    mutationFn: async (data: PaymentProps) => {
      const response = await api.post("/payment/initialise", {
        orderId: data.orderId,
        email: data.email,
        callback_url: data.callback_url,
        paymentData: {
          email: data.email,
          callback_url: data.callback_url,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Store full init response so reference is at payment.reference
      setPaymentPayload({
        payment: data.payment,
        access_code: data.access_code,
        authorization_url: data.authorization_url,
      });
      setPaymentlinkModalOpen(true);
    },
    onError: (error) => {
      console.error("Failed to initialise payment", error);
    },
  });
};
