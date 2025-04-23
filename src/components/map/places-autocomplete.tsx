"use client";

import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useLoadScript } from "@react-google-maps/api";
import { Prediction } from "@/modules/shop/components/header";
import { useUpdateUser } from "@/modules/user/mutations/update-user";
import useAuthStore from "@/store/auth";
import { useAddAddress } from "@/modules/user/mutations/add-address";

const libraries = ["places"];

interface PlacesAutocompleteProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  predictions: google.maps.places.AutocompletePrediction[];
  setPredictions: Dispatch<
    SetStateAction<google.maps.places.AutocompletePrediction[]>
  >;
}

export default function CustomPlacesAutocomplete({
  input,
  setInput,
  predictions,
  setPredictions,
}: PlacesAutocompleteProps) {
  // const [input, setInput] = useState("");
  // const [predictions, setPredictions] = useState<Prediction[]>([]);
  const { user } = useAuthStore();
  const { mutateAsync: updateUser } = useUpdateUser(String(user?.id));
  const { mutateAsync: addAddress } = useAddAddress();

  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: libraries as any,
  });

  useEffect(() => {
    if (isLoaded && !autocompleteService) {
      setAutocompleteService(
        new window.google.maps.places.AutocompleteService()
      );
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!autocompleteService || input === "") {
      setPredictions([]);
      return;
    }

    autocompleteService.getPlacePredictions(
      { input, componentRestrictions: { country: "ng" } },
      (results) => {
        if (results) {
          setPredictions(results);
        }
      }
    );
  }, [input, autocompleteService]);

  const handleSelect = async (prediction: Prediction) => {
    setInput(prediction.description);
    setPredictions([]);

    try {
      await updateUser({
        address: prediction.description,
      });

      await addAddress({
        description: prediction.description,
        place_id: prediction.place_id,
        reference: prediction?.place_id,
        types: prediction.types,
      });
    } catch (error) {
      console.log(error);
    }

    // Optional: use PlacesService to get full details like lat/lng
    console.log("Selected Prediction:", prediction);
  };

  return (
    <div className="relative w-full max-w-md">
      <Command className="bg-gray-200 rounded-md border shadow-sm">
        <CommandInput
          placeholder="Search location..."
          value={input}
          onValueChange={setInput}
        />
        {predictions.length > 0 && (
          <CommandList className="absolute z-10 top-full left-0 right-0 bg-white border shadow-md max-h-60 overflow-y-auto">
            {predictions.map((prediction) => (
              <CommandItem
                key={prediction.place_id}
                value={prediction.description}
                onSelect={() => handleSelect(prediction)}
              >
                {prediction.description}
              </CommandItem>
            ))}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
