import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import DeliveryInformation from "./delivery-information";
import PickupInformation from "./pickup-information";
import { useFetchVendorStoreById } from "@/modules/shop/queries/fetch-vendor-store-by-id";
import { useCartViewStore } from "@/store/cart-data";
import useAuthStore from "@/store/auth";
import { useFetchUserInformation } from "@/modules/user/queries/fetch-user-information";
import { useGoogleMaps } from "@/hooks/use-google-maps";

const PaymentPage = () => {
  const { openStoreId } = useCartViewStore();
  const { user } = useAuthStore();
  const { data: storeInformation } = useFetchVendorStoreById(
    String(openStoreId)
  );
  const { data: userInformation } = useFetchUserInformation(String(user?.id));

  const [routeInfo, setRouteInfo] = useState<{
    distanceKm: number;
    distance: string;
    duration: string;
    summary: string;
  } | null>(null);

  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    const origin = storeInformation?.address;
    const destination = userInformation?.address;
    if (!isLoaded || !origin || !destination || !window.google) return;

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
          const meters = leg.distance?.value ?? 0;
          setRouteInfo({
            distanceKm: meters / 1000,
            distance: leg.distance?.text || "",
            duration: leg.duration?.text || "",
            summary: route.summary,
          });
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [isLoaded, storeInformation?.address, userInformation?.address]);

  const thresholdInKm = 15;
  const distanceToVendor = routeInfo?.distanceKm ?? NaN;
  const storeDeliveryFee = Number(storeInformation?.deliveryFee ?? 3000);

  return (
    <div className="pt-10">
      <Tabs defaultValue="delivery" className="overflow-auto">
        <TabsList className="mx-auto grid h-11 w-full grid-cols-2 rounded-full bg-green-200 transition">
          <TabsTrigger
            value="delivery"
            className="relative rounded-full py-2 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:transition"
          >
            Delivery
          </TabsTrigger>
          <TabsTrigger
            value="pickup"
            className="relative rounded-full py-2 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:transition"
          >
            Pickup
          </TabsTrigger>
        </TabsList>
        <TabsContent value="delivery" className="h-[73vh]">
          <DeliveryInformation
            thresholdInKm={thresholdInKm}
            distanceToVendor={distanceToVendor}
            userId={String(user?.id)}
            storeId={storeInformation?.id}
            storeAddress={storeInformation?.address}
            userAddress={userInformation?.address}
            storeDeliveryFee={
              Number.isFinite(storeDeliveryFee) ? storeDeliveryFee : 3000
            }
          />
        </TabsContent>
        <TabsContent value="pickup">
          <PickupInformation
            thresholdInKm={thresholdInKm}
            distanceToVendor={distanceToVendor}
            userId={String(user?.id)}
            storeId={storeInformation?.id}
            storeAddress={storeInformation?.address}
            userAddress={userInformation?.address}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentPage;
