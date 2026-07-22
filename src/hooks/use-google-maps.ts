import { useLoadScript } from "@react-google-maps/api";
import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_LIBRARIES,
} from "@/lib/google-maps-config";

/** Single shared loader for Maps JS + Places. Call from any map-dependent UI. */
export function useGoogleMaps() {
  return useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });
}
