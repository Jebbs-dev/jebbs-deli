'use client';

import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 6.5244, // Default to Lagos, Nigeria (or your region)
  lng: 3.3792,
};

const MapComponent = ({ directions }: { directions: any }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
