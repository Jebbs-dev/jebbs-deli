import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { useGoogleMaps } from "@/hooks/use-google-maps";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 6.5244,
  lng: 3.3792,
};

const MapComponent = ({
  directions,
}: {
  directions: google.maps.DirectionsResult | null;
}) => {
  const { isLoaded, loadError } = useGoogleMaps();

  if (loadError) {
    return (
      <p className="text-sm text-red-600">
        Unable to load map. Check your Google Maps API configuration.
      </p>
    );
  }

  if (!isLoaded) {
    return <p className="text-sm text-ash/60">Loading map…</p>;
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
      {directions ? <DirectionsRenderer directions={directions} /> : null}
    </GoogleMap>
  );
};

export default MapComponent;
