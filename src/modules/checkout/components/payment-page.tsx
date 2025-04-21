import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import DeliveryInformation from "./delivery-information";
import PickupInformation from "./pickup-information";

const PaymentPage = () => {
  const [toggleDeliveryOption, setToggleDeliveryOption] = useState<
    "delivery" | "pickup"
  >("delivery");

  return (
    <>
      <div className="pt-10">
        <Tabs defaultValue="delivery" className="overflow-auto ">
          <TabsList className="grid grid-cols-2 w-full mx-auto rounded-full transition bg-green-200 h-11">
            <TabsTrigger
              value="delivery"
              onClick={() => setToggleDeliveryOption("delivery")}
              className="rounded-full data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:transition relative py-2"
            >
              Delivery
            </TabsTrigger>
            <TabsTrigger
              value="pickup"
              onClick={() => setToggleDeliveryOption("pickup")}
              className="rounded-full data-[state=active]:bg-green-700 data-[state=active]:text-white  data-[state=active]:transition relative py-2"
            >
              Pickup
            </TabsTrigger>
          </TabsList>
          <TabsContent value="delivery" className="h-[73vh]">
            <DeliveryInformation />
          </TabsContent>
          <TabsContent value="pickup">
            <PickupInformation />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default PaymentPage;
