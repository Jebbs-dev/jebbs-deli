import { Button } from "@/components/ui/button";
import { Banknote, Bike, CircleAlert } from "lucide-react";
import React from "react";

const PickupInformation = () => {
  const thresholdInKm = 15;
  const distanceToVendor = 14;

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
          <p>Sub-total(4 items)</p>
          <p>#12,000</p>
        </span>
        <span className="flex flex-row justify-between items-center h-10">
          <p>Delivery Fee</p>
          <p>#3,000</p>
        </span>
        {(distanceToVendor > thresholdInKm) && (
          <div className="border-b border-gray-200 py-3">
            <span className="flex flex-row gap-4 items-center h-20 bg-red-200 rounded-md p-2">
              <Bike className="w-1/4" />
              <p className="text-red-700 text-sm flex-grow">
                The vendor is 20km away, consider ordering from a nearby vendor
                to get lower delivery fees
              </p>
            </span>
          </div>
        )}
        <span className="flex flex-row justify-between items-center h-10">
          <span className="flex flex-row gap-2 items-center">
            <p> Service Fee</p>
            <CircleAlert size={17} className="text-yellow-500" />
          </span>
          <p>#1,200</p>
        </span>
        <span className="flex flex-row justify-between items-center h-10 font-semibold">
          <p>Total</p>
          <p>#18,700</p>
        </span>
      </div>
      <div className="border-b border-gray-200 py-2">
        <span className="flex flex-row gap-4 items-center h-10">
          <p className="font-medium">Payment Method</p>
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <Button asChild>
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

export default PickupInformation;
