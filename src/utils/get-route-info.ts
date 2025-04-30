import { useLoadScript } from "@react-google-maps/api";



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
    
        
        console.log('Full Directions Result:', result);
      } else {
        console.error('Directions request failed:', status);
      }
    }
  );
};