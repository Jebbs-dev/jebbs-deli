import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import DeliveryInformation from "./delivery-information";
import PickupInformation from "./pickup-information";
import { useLoadScript } from "@react-google-maps/api";
import { useFetchVendorStoreById } from "@/modules/shop/queries/fetch-vendor-store-by-id";
import { useCartViewStore } from "@/store/cart-data";
import useAuthStore from "@/store/auth";
import { useFetchUserInformation } from "@/modules/user/queries/fetch-user-information";

const PaymentPage = () => {
  const { openStoreId } = useCartViewStore();
  const { user } = useAuthStore();
  const { data: storeInformation } = useFetchVendorStoreById(
    String(openStoreId)
  );
  const { data: userInformation } = useFetchUserInformation(String(user?.id));

  const [toggleDeliveryOption, setToggleDeliveryOption] = useState<
    "delivery" | "pickup"
  >("delivery");

  

  const libraries = ["places"];
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    summary: string;
  } | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: libraries as any,
  });

  const getRoute = (origin: string, destination: string) => {
    if (!window.google) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (
          status === window.google.maps.DirectionsStatus.OK &&
          result?.routes?.length
        ) {
          const route = result.routes[0];
          const leg = route.legs[0];
          setRouteInfo({
            distance: leg.distance?.text || "",
            duration: leg.duration?.text || "",
            summary: route.summary,
          });

          console.log("Full Directions Result:", result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };
  useEffect(() => {
    getRoute(storeInformation?.address, userInformation?.address);
  }, [storeInformation?.address, userInformation?.address]);

  console.log(routeInfo);

  const thresholdInKm = 15;
  const distanceToVendor = parseFloat(String(routeInfo?.distance));

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
            <DeliveryInformation thresholdInKm={thresholdInKm} distanceToVendor={distanceToVendor} userId={String(user?.id)} storeId={storeInformation?.id} storeAddress={storeInformation?.address} userAddress={userInformation?.address} />
          </TabsContent>
          <TabsContent value="pickup">
            <PickupInformation thresholdInKm={thresholdInKm} distanceToVendor={distanceToVendor} userId={String(user?.id)} storeId={storeInformation?.id} storeAddress={storeInformation?.address} userAddress={userInformation?.address} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default PaymentPage;
