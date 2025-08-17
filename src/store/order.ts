import { Order } from "@/types/types";
import { create } from "zustand";

interface PaymentInitialisePayload {
  payment: Record<string, any>;
  access_code: string;
  authorization_url: string;
}

interface OrderProps {
  orderData: Order | null;
  setOrderData: (orderData: Order) => void;
  paymentPayload: PaymentInitialisePayload | null;
  setPaymentPayload: (payload: PaymentInitialisePayload) => void;
  paymentLinkModalOpen: boolean;
  setPaymentlinkModalOpen: (linkOpen: boolean) => void;
  // setPaymentlinkModalClose: ()
}

export const useOrderData = create<OrderProps>((set) => ({
  orderData: null as Order | null,
  setOrderData: (orderData) => set({ orderData }),
  paymentPayload: null as PaymentInitialisePayload | null,
  setPaymentPayload: (payload) => set({ paymentPayload: payload }),
  paymentLinkModalOpen: false,
  setPaymentlinkModalOpen: (linkOpen) =>
    set({ paymentLinkModalOpen: linkOpen }),
}));
