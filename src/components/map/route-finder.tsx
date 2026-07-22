"use client";

import { useState } from "react";
import { useGoogleMaps } from "@/hooks/use-google-maps";

export default function RouteFinder() {
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    summary: string;
  } | null>(null);

  const { isLoaded, loadError } = useGoogleMaps();

  const getRoute = (origin: string, destination: string) => {
    if (!isLoaded || !window.google) return;

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
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };

  return (
    <div className="max-w-md space-y-4">
      <button
        type="button"
        className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        disabled={!isLoaded || Boolean(loadError)}
        onClick={() =>
          getRoute("Lekki Phase 1, Lagos", "Ikeja City Mall, Lagos")
        }
      >
        {isLoaded ? "Get Route Info" : "Loading maps…"}
      </button>

      {loadError ? (
        <p className="text-sm text-red-600">Failed to load Google Maps.</p>
      ) : null}

      {routeInfo && (
        <div className="rounded bg-gray-100 p-4 shadow">
          <p>
            <strong>Distance:</strong> {routeInfo.distance}
          </p>
          <p>
            <strong>Duration:</strong> {routeInfo.duration}
          </p>
          <p>
            <strong>Route Summary:</strong> {routeInfo.summary}
          </p>
        </div>
      )}
    </div>
  );
}
