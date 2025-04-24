import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFetchVendorStoreById } from "@/modules/shop/queries/fetch-vendor-store-by-id";
import { useCartViewStore } from "@/store/cart-data";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import {
  Banknote,
  Bike,
  CalendarCheck,
  ChevronRight,
  CircleAlert,
  MapPin,
} from "lucide-react";
import React from "react";
import { useCreateOrder } from "@/modules/checkout/mutations/create-order";
import { useUpdateCart } from "@/modules/shop/cart/mutations/update-cart";
import useAuthStore from "@/store/auth";

interface DeliveryInformationProps {
  thresholdInKm: number;
  distanceToVendor: number;
  userId: string;
  storeId: string;
  storeAddress: string;
  userAddress: string;
}

const DeliveryInformation = ({
  thresholdInKm,
  distanceToVendor,
  userId,
  storeId,
  storeAddress,
  userAddress,
}: DeliveryInformationProps) => {
  const { storeTotals, cartTotal, typedCartData } = useCartViewStore();

  const { mutateAsync: createOrder } = useCreateOrder();

  const { mutateAsync: updateCart } = useUpdateCart();

  // const thresholdInKm = 15;
  // const distanceToVendor = 14;
  const deliveryFee = 3000;
  const serviceFee = 0.1 * cartTotal;
  const totalOrderCost = deliveryFee + serviceFee + cartTotal;

  const handlePlaceOrder = async () => {
    const orderData = {
      userId,
      storeId,
      serviceFee: serviceFee,
      deliveryFee: deliveryFee,
      subTotal: cartTotal,
      totalPrice: totalOrderCost,
      status: "pending",
      vendorAddress: storeAddress,
      customerAddress: userAddress,
    };

    const orderItems = storeTotals.flatMap((store) =>
      store.products.map((product) => ({
        storeId: store.storeId,
        orderId: "",
        productId: product.id,
        quantity: product.quantity,
      }))
    );

    try {
      await createOrder({ orderData, orderItems });

      await updateCart({
        cartId: typedCartData!.id,
        userId: userId,
        cartItems: [], // Empty array will clear all cart groups
        totalPrice: 0,
      });

      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Order creation failed:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="py-5">
      <div className="border-b border-gray-200 py-2">
        <span className="flex flex-row gap-4 text-gray-500 items-center">
          <CircleAlert size={17} />
          <p>Delivery requires PIN confirmation</p>
        </span>
      </div>
      <div className="border-b border-gray-200 py-3">
        <span className="flex flex-row gap-4 items-center h-10">
          <MapPin size={17} className="text-gray-500" />
          <span className="flex flex-col">
            <p>Delivery address will be here</p>
            <p className="text-xs text-gray-500">Delivery Address</p>
          </span>
        </span>
      </div>
      <div className="border-b border-gray-200 py-2">
        <span className="flex flex-row justify-between items-center h-10">
          <span className="flex flex-row gap-4 items-center">
            <Bike size={17} className="text-gray-500" />
            <p>Note for the rider</p>
          </span>
          <ChevronRight size={17} />
        </span>
      </div>
      <div className="border-b border-gray-200 py-2">
        <span className="flex flex-row gap-4 items-center h-10">
          <p className="font-medium">Available Delivery Time</p>
        </span>
      </div>
      <RadioGroup defaultValue="now">
        <div className="border-b border-gray-200 py-2">
          <span className="flex flex-row justify-between items-center h-10">
            <span className="flex flex-row gap-4 items-center">
              <CalendarCheck size={17} />
              <Label htmlFor="now" className="font-normal text-base text-black">
                Right now
              </Label>
            </span>
            <RadioGroupItem
              value="now"
              id="now"
              defaultChecked
              className="border-black"
            />
          </span>
        </div>
        <div className="border-b border-gray-200 py-2">
          <span className="flex flex-row justify-between items-center h-10">
            <span className="flex flex-row gap-4 items-center">
              <CalendarCheck size={17} />
              <Label
                htmlFor="schedule"
                className="font-normal text-base text-black"
              >
                Schedule delivery
              </Label>
            </span>
            <RadioGroupItem
              value="schedule"
              id="schedule"
              className="border-black"
            />
          </span>
        </div>
      </RadioGroup>
      <div className="border-b border-gray-200 py-2">
        <span className="flex flex-row gap-4 items-center h-10">
          <p className="font-medium">Payment Summary</p>
        </span>
      </div>
      <div className="border-b border-gray-200 py-3">
        <span className="flex flex-row gap-4 items-center justify-center h-20 bg-pink-200 rounded-md">
          <p className="text-pink-800 font-semibold">Spin the wheel</p>
        </span>
      </div>
      <div className="border-b border-gray-200 py-3">
        <span className="flex flex-row gap-4 items-center h-10">
          <Banknote size={17} className="text-pink-500" />
          <p>Use Promo Code</p>
        </span>
      </div>
      <div className="border-b border-gray-200 py-2">
        <span className="flex flex-row justify-between items-center h-10">
          <p>
            Sub-total ({storeTotals.length}{" "}
            {storeTotals.length === 1 ? "item" : "items"})
          </p>
          <p>₦{formatNumberWithCommas(Number(cartTotal.toFixed(2)))}</p>
        </span>
        <span className="flex flex-row justify-between items-center h-10">
          <p>Delivery Fee</p>
          <p>₦{formatNumberWithCommas(Number(deliveryFee.toFixed(2)))}</p>
        </span>
        {distanceToVendor > thresholdInKm && (
          <div className="border-b border-gray-200 py-3">
            <span className="flex flex-row gap-4 items-center h-20 bg-red-200 rounded-md p-2">
              <Bike className="w-1/4 text-red-700" />
              <p className="text-red-700 text-sm flex-grow">
                {`The vendor is ${distanceToVendor} away, consider ordering from a nearby vendor
                to get lower delivery fees`}
              </p>
            </span>
          </div>
        )}
        <span className="flex flex-row justify-between items-center h-10">
          <span className="flex flex-row gap-2 items-center">
            <p> Service Fee</p>
            <CircleAlert size={17} className="text-yellow-500" />
          </span>
          <p>₦{formatNumberWithCommas(Number(serviceFee.toFixed(2)))}</p>
        </span>
        <span className="flex flex-row justify-between items-center h-10 font-semibold">
          <p>Total</p>
          <p>₦{formatNumberWithCommas(Number(totalOrderCost.toFixed(2)))}</p>
        </span>
      </div>
      <div className="border-b border-gray-200 py-2">
        <span className="flex flex-row gap-4 items-center h-10">
          <p className="font-medium">Payment Method</p>
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <Button asChild onClick={handlePlaceOrder}>
          <span className="flex items-center justify-center rounded-md border border-transparent bg-orange-400 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-orange-600">
            Place Order
          </span>
        </Button>
        <Button className="w-full bg-red-100 px-6 py-3 text-red-500 text-sm hover:bg-red-200">
          Clear Order
        </Button>
      </div>
    </div>
  );
};

export default DeliveryInformation;
