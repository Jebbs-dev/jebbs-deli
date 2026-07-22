import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartViewStore } from "@/store/cart-data";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import { Banknote, CircleAlert, MapPin, Wallet } from "@/components/icons";
import { useState } from "react";
import {
  useCreateOrder,
  type OrderPaymentMethod,
} from "../mutations/create-order";
import { useUpdateCart } from "@/modules/shop/cart/mutations/update-cart";
import { FaSpinner } from "react-icons/fa6";
import { useToast } from "@/hooks/use-toast";
import { useFetchWallet } from "@/modules/wallet/queries/fetch-wallet";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import useCartStore from "@/store/cart";

interface PickupInformationProps {
  thresholdInKm: number;
  distanceToVendor: number;
  userId: string;
  storeId: string;
  storeAddress: string;
  userAddress: string;
}

const PickupInformation = ({
  userId,
  storeId,
  storeAddress,
  userAddress,
}: PickupInformationProps) => {
  const { storeTotals, typedCartData, openStoreId, setIsOpen } =
    useCartViewStore();
  const { clearCart } = useCartStore();

  const { mutateAsync: createOrder, isPending: isOrderCreationPending } =
    useCreateOrder();

  const { mutateAsync: updateCart, isPending: isCartUpdatePending } =
    useUpdateCart();

  const { toast } = useToast();
  const { data: wallet } = useFetchWallet();
  const [paymentMethod, setPaymentMethod] =
    useState<OrderPaymentMethod>("paystack");

  const activeStore =
    storeTotals.find((store) => store.storeId === openStoreId) ??
    storeTotals.find((store) => store.storeId === storeId);
  const orderProducts = activeStore?.products ?? [];
  const itemCount = activeStore?.totalQuantity ?? 0;
  const subTotal = activeStore?.totalAmount ?? 0;

  const serviceFee = 0.1 * subTotal;
  const totalOrderCost = serviceFee + subTotal;
  const walletBalance = Number(wallet?.balance ?? 0);
  const canPayWithWallet = walletBalance >= totalOrderCost;

  const handleClearOrder = async () => {
    if (typedCartData?.id) {
      try {
        await updateCart({
          cartId: typedCartData.id,
          userId,
          cartItems: [],
          totalPrice: 0,
        });
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }
    } else {
      clearCart();
    }
    setIsOpen(false);
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "wallet" && !canPayWithWallet) {
      toast({
        variant: "destructive",
        title: "Insufficient wallet balance",
        description: "Top up your wallet or pay with Paystack.",
      });
      return;
    }

    const orderData = {
      userId,
      storeId,
      serviceFee,
      deliveryFee: 0,
      subTotal,
      totalPrice: totalOrderCost,
      status: "pending",
      vendorAddress: storeAddress,
      customerAddress: userAddress || storeAddress,
    };

    const orderItems = orderProducts.map((product) => ({
      storeId: activeStore?.storeId ?? storeId,
      orderId: "",
      productId: product.id,
      quantity: product.quantity,
    }));

    try {
      await createOrder({ orderData, orderItems, paymentMethod });

      if (typedCartData?.id) {
        await updateCart({
          cartId: typedCartData.id,
          userId,
          cartItems: [],
          totalPrice: 0,
        });
      }

      setIsOpen(false);

      toast({
        title: "Success",
        description:
          paymentMethod === "wallet"
            ? "Order paid with wallet."
            : "Order created successfully!",
      });
    } catch (error: unknown) {
      console.error("Order creation failed:", error);
      const message =
        (error as { response?: { data?: { message?: string } }; message?: string })
          ?.response?.data?.message ||
        (error as Error)?.message ||
        "Order failed";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }
  };

  return (
    <div className="flex flex-col gap-1 py-5">
      <div className="border-b border-gray-200 py-3">
        <span className="flex h-20 flex-row items-center gap-2 rounded-md bg-gray-200 p-2">
          <CircleAlert size={18} />
          <p className="flex-grow text-sm text-gray-600">
            You&apos;ve selected pickup — collect your meal at the restaurant.
          </p>
        </span>
      </div>

      <div className="border-b border-gray-200 py-3">
        <span className="flex h-auto min-h-10 flex-row items-start gap-4">
          <MapPin size={17} className="mt-0.5 shrink-0 text-gray-500" />
          <span className="flex flex-col">
            <p className="text-ash">
              {storeAddress?.trim() || "Store address unavailable"}
            </p>
            <p className="text-xs text-gray-500">Pickup Address</p>
          </span>
        </span>
      </div>

      <div className="border-b border-gray-200 py-2">
        <p className="font-medium text-ash">Payment Method</p>
      </div>
      <RadioGroup
        value={paymentMethod}
        onValueChange={(value) =>
          setPaymentMethod(value as OrderPaymentMethod)
        }
        className="mb-2"
      >
        <div className="border-b border-gray-200 py-2">
          <span className="flex h-10 flex-row items-center justify-between">
            <span className="flex flex-row items-center gap-3">
              <Wallet size={17} className="text-ash/60" />
              <div>
                <Label
                  htmlFor="pickup-pay-wallet"
                  className={cn(
                    "text-base font-normal",
                    canPayWithWallet ? "text-black" : "text-ash/40"
                  )}
                >
                  Pay with wallet
                </Label>
                <p className="text-xs text-ash/50">
                  Balance ₦
                  {formatNumberWithCommas(Number(walletBalance.toFixed(2)))}
                  {!canPayWithWallet ? (
                    <>
                      {" · "}
                      <Link
                        to="/shop/wallet"
                        className="text-scotch hover:underline"
                      >
                        Top up
                      </Link>
                    </>
                  ) : null}
                </p>
              </div>
            </span>
            <RadioGroupItem
              value="wallet"
              id="pickup-pay-wallet"
              disabled={!canPayWithWallet}
              className="border-black"
            />
          </span>
        </div>
        <div className="border-b border-gray-200 py-2">
          <span className="flex h-10 flex-row items-center justify-between">
            <span className="flex flex-row items-center gap-3">
              <Banknote size={17} className="text-ash/60" />
              <Label
                htmlFor="pickup-pay-paystack"
                className="text-base font-normal text-black"
              >
                Pay with Paystack
              </Label>
            </span>
            <RadioGroupItem
              value="paystack"
              id="pickup-pay-paystack"
              className="border-black"
            />
          </span>
        </div>
      </RadioGroup>

      <div className="border-b border-gray-200 py-2">
        <p className="font-medium text-ash">Payment Summary</p>
      </div>
      <div className="border-b border-gray-200 py-2">
        <span className="flex h-10 flex-row items-center justify-between">
          <p>
            Sub-total ({itemCount} {itemCount === 1 ? "item" : "items"})
          </p>
          <p>₦{formatNumberWithCommas(Number(subTotal.toFixed(2)))}</p>
        </span>
        <span className="flex h-10 flex-row items-center justify-between">
          <span className="flex flex-row items-center gap-2">
            <p>Service Fee</p>
            <CircleAlert size={17} className="text-yellow-500" />
          </span>
          <p>₦{formatNumberWithCommas(Number(serviceFee.toFixed(2)))}</p>
        </span>
        <span className="flex h-10 flex-row items-center justify-between font-semibold">
          <p>Total</p>
          <p>₦{formatNumberWithCommas(Number(totalOrderCost.toFixed(2)))}</p>
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <Button
          type="button"
          className="w-full rounded-md bg-orange-400 text-white hover:bg-orange-600"
          onClick={() => void handlePlaceOrder()}
          disabled={isOrderCreationPending || isCartUpdatePending}
        >
          {isOrderCreationPending || isCartUpdatePending ? (
            <>
              Creating Order
              <FaSpinner className="ml-2 animate-spin" />
            </>
          ) : paymentMethod === "wallet" ? (
            "Pay with wallet"
          ) : (
            "Place Order"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full border-destructive/30 bg-red-50 text-red-500 hover:bg-red-100"
          onClick={() => void handleClearOrder()}
          disabled={isCartUpdatePending}
        >
          Clear Order
        </Button>
      </div>
    </div>
  );
};

export default PickupInformation;
