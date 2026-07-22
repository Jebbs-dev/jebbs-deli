/** Directions helper — prefer useGoogleMaps + DirectionsService in components. */
export function getRoute(
  origin: string,
  destination: string,
  onResult?: (info: {
    distance: string;
    duration: string;
    summary: string;
    distanceKm: number;
  }) => void
) {
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
        const meters = leg.distance?.value ?? 0;
        onResult?.({
          distance: leg.distance?.text || "",
          duration: leg.duration?.text || "",
          summary: route.summary,
          distanceKm: meters / 1000,
        });
      } else {
        console.error("Directions request failed:", status);
      }
    }
  );
}
