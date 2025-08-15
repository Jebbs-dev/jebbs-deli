import { Button } from "@/components/ui/button";
import { useCartViewStore } from "@/store/cart-data";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import { Banknote, Bike, CircleAlert } from "lucide-react";
import React from "react";
import { useCreateOrder } from "../mutations/create-order";
import { useUpdateCart } from "@/modules/shop/cart/mutations/update-cart";
import { FaSpinner } from "react-icons/fa6";
import { useToast } from "@/hooks/use-toast";

interface PickupInformationProps {
  thresholdInKm: number;
  distanceToVendor: number;
  userId: string;
  storeId: string;
  storeAddress: string;
  userAddress: string;
}
const PickupInformation = ({
  thresholdInKm,
  distanceToVendor,
  userId,
  storeId,
  storeAddress,
  userAddress,
}: PickupInformationProps) => {
  const { storeTotals, cartTotal, typedCartData, setIsOpen } =
    useCartViewStore();

  const { mutateAsync: createOrder, isPending: isOrderCreationPending } =
    useCreateOrder();

  const { mutateAsync: updateCart, isPending: isCartUpdatePending } =
    useUpdateCart();

  const { toast } = useToast();

  const serviceFee = 0.1 * cartTotal;
  const totalOrderCost = serviceFee + cartTotal;

  const handlePlaceOrder = async () => {
    const orderData = {
      userId,
      storeId,
      serviceFee: serviceFee,
      deliveryFee: 0,
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

      setIsOpen(false);

      toast({
        title: "Success",
        description: "Order created successfully!",
      });
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="py-5">
      <div className="border-b border-gray-200 py-3">
        <span className="flex flex-row gap-2 items-center h-20 bg-gray-200 rounded-md p-2">
          <CircleAlert size={18} />
          <p className="text-gray-600 text-sm flex-grow">
            You&apos;ve selected the pickup option; you will have to pick up
            your meal at the restaurant
          </p>
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
        {/* <span className="flex flex-row justify-between items-center h-10">
          <p>Delivery Fee</p>
          <p>₦{formatNumberWithCommas(Number(deliveryFee.toFixed(2)))}</p>
        </span> */}
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
            {isOrderCreationPending || isCartUpdatePending ? (
              <>
                Creating Order
                <span className="ml-2 text-sm">
                  <FaSpinner className="animate-spin" />
                </span>
              </>
            ) : (
              <> Place Order </>
            )}
          </span>
        </Button>
        <Button className="w-full bg-red-100 px-6 py-3 text-red-500 text-sm hover:bg-red-200">
          Clear Order
        </Button>
      </div>
    </div>
  );
};

export default PickupInformation;
