import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { useOrderData } from "@/store/order";
import Link from "next/link";
import React from "react";
import { useInitialisePayment } from "../mutations/initiate-payment";
import { FaSpinner } from "react-icons/fa6";

const PaymentLinkModal = () => {
  const { paymentPayload, paymentLinkModalOpen, setPaymentlinkModalOpen } =
    useOrderData();

  const { isPending: isPaymentInitialisationPending } = useInitialisePayment();

  return (
    <Dialog open={paymentLinkModalOpen} onOpenChange={setPaymentlinkModalOpen}>
      <DialogContent>
        {isPaymentInitialisationPending ? (
          <div className="flex items-center justify-center bg-transparent">
            <p className="mr-2">Loading payment link. Please wait...</p>
            <FaSpinner size={24} className="animate-spin" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Proceed to Payment</DialogTitle>
              <DialogDescription>
                Click on the button below to pay for your order.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-center">
              <Button asChild>
                <Link
                  href={`${paymentPayload?.authorization_url}`}
                  className="bg-green-500 hover:bg-green-800 flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-sm font-medium text-white shadow-sm"
                >
                  Proceed to Payment
                </Link>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentLinkModal;
