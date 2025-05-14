"use client";

import React, { useState } from "react";

import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Services = () => {
  const slideLeft = () => {
    const slider = document.getElementById("slider");
    if (slider) {
      slider.scrollLeft = slider.scrollLeft - 320;
    }
  };

  const slideRight = () => {
    const slider = document.getElementById("slider");
    if (slider) {
      slider.scrollLeft = slider.scrollLeft + 320;
    }
  };

  const [mealQuantity, setMealQuantity] = useState(1);

  const [tabValue, setTabValue] = useState("customers");

  return (
    <div className="w-full bg-orange-50" id="services">
      <div className="max-w-[90vw] mx-auto py-10 md:p-20">
        <div className="">
          <Tabs defaultValue="customers">
            <TabsList className="grid grid-cols-2 w-64 mx-auto rounded-full transition bg-orange-200 h-12">
              <TabsTrigger
                value="customers"
                onClick={() => setTabValue("customers")}
                className="rounded-full data-[state=active]:bg-orange-400 data-[state=active]:text-white data-[state=active]:transition py-2.5 relative"
              >
                Customers
              </TabsTrigger>
              <TabsTrigger
                value="vendors"
                onClick={() => setTabValue("vendors")}
                className="rounded-full data-[state=active]:bg-orange-400 data-[state=active]:text-white  data-[state=active]:transition py-2.5 relative"
              >
                Vendors
              </TabsTrigger>
            </TabsList>
            <TabsContent value="customers">
              <div className="flex flex-col justify-center items-center mt-10 w-[80vw] md:w-[50vw] mx-auto gap-3">
                <h2 className="text-3xl md:text-5xl font-bold text-center">
                  Order Your Favourite Dishes
                </h2>
                <p className="w-[80vw] md:w-[40vw] mx-auto text-center">
                  Have meals delivered to you within minutes from a wide variety
                  of restaurants ranging from African to Continental cuisines to
                  satisfy your cravings.
                </p>

                <Image
                  src="/images/phone-food-2.png"
                  width={400}
                  height={400}
                  alt="Food on phone"
                  className="w-[300px] h-[600px]"
                />
              </div>
            </TabsContent>
            <TabsContent value="vendors">
              <div className="flex flex-col justify-center items-center mt-10 w-[80vw] md:w-[50vw] mx-auto gap-3">
                <h2 className="text-3xl md:text-5xl font-bold text-center">
                  Connect with Customers
                </h2>
                <p className="w-[80vw] md:w-[40vw] mx-auto text-center">
                  Unlock new levels of growth with seamless menu and orders
                  management, multiple branches and team, easy payouts
                  withdrawal and a lot more.
                </p>

                <Image
                  src="/images/phone-food-2.png"
                  width={400}
                  height={400}
                  alt="Food on phone"
                  className="w-[300px] h-[600px]"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
