'use client';

import { useLoadScript } from '@react-google-maps/api';
import { useState } from 'react';

const libraries = ['places'];

export default function RouteFinder() {
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
        if (status === window.google.maps.DirectionsStatus.OK && result?.routes?.length) {
          const route = result.routes[0];
          const leg = route.legs[0];
          setRouteInfo({
            distance: leg.distance?.text || '',
            duration: leg.duration?.text || '',
            summary: route.summary,
          });

          console.log('Full Directions Result:', result);
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  };

  return (
    <div className="space-y-4 max-w-md">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => getRoute('Lekki Phase 1, Lagos', 'Ikeja City Mall, Lagos')}
      >
        Get Route Info
      </button>

      {routeInfo && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <p><strong>Distance:</strong> {routeInfo.distance}</p>
          <p><strong>Duration:</strong> {routeInfo.duration}</p>
          <p><strong>Route Summary:</strong> {routeInfo.summary}</p>
        </div>
      )}
    </div>
  );
}
