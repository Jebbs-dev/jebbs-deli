"use client";

import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useGoogleMaps } from "@/hooks/use-google-maps";
import { useDebounce } from "@/hooks/use-debounce";

/** Normalized place suggestion used by header + address dialogs. */
export type PlacePrediction = {
  description: string;
  place_id: string;
  types: string[];
};

interface PlacesAutocompleteProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  predictions: PlacePrediction[];
  setPredictions: Dispatch<SetStateAction<PlacePrediction[]>>;
  /** Called when the user picks a suggestion from the list (does not save yet). */
  onLocationPicked?: (prediction: PlacePrediction) => void;
}

type PlacesLibrary = {
  AutocompleteSuggestion?: {
    fetchAutocompleteSuggestions: (request: {
      input: string;
      includedRegionCodes?: string[];
    }) => Promise<{
      suggestions: Array<{
        placePrediction?: {
          text?: { text?: string } | string;
          placeId?: string;
          types?: string[];
        } | null;
      }>;
    }>;
  };
};

async function fetchPlacePredictions(
  input: string
): Promise<PlacePrediction[]> {
  const places = (await google.maps.importLibrary(
    "places"
  )) as PlacesLibrary;

  const AutocompleteSuggestion = places.AutocompleteSuggestion;
  if (!AutocompleteSuggestion?.fetchAutocompleteSuggestions) {
    throw new Error("Places AutocompleteSuggestion API is unavailable");
  }

  const { suggestions } =
    await AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input,
      includedRegionCodes: ["ng"],
    });

  return suggestions
    .map((suggestion) => {
      const prediction = suggestion.placePrediction;
      if (!prediction?.placeId) return null;

      const text =
        typeof prediction.text === "string"
          ? prediction.text
          : prediction.text?.text ?? "";

      if (!text) return null;

      return {
        description: text,
        place_id: prediction.placeId,
        types: prediction.types ?? [],
      } satisfies PlacePrediction;
    })
    .filter((item): item is PlacePrediction => item !== null);
}

export default function CustomPlacesAutocomplete({
  input,
  setInput,
  predictions,
  setPredictions,
  onLocationPicked,
}: PlacesAutocompleteProps) {
  const { isLoaded, loadError } = useGoogleMaps();
  const debouncedInput = useDebounce(input, 300);
  const skipNextFetchRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !debouncedInput.trim()) {
      setPredictions([]);
      return;
    }

    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      setPredictions([]);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const results = await fetchPlacePredictions(debouncedInput.trim());
        if (!cancelled) setPredictions(results);
      } catch (error) {
        console.error("Places autocomplete failed:", error);
        if (!cancelled) setPredictions([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedInput, isLoaded, setPredictions]);

  const handleSelect = (prediction: PlacePrediction) => {
    skipNextFetchRef.current = true;
    setPredictions([]);
    setInput(prediction.description);
    onLocationPicked?.(prediction);
  };

  return (
    <div className="relative w-full max-w-md">
      <Command
        shouldFilter={false}
        className="overflow-visible rounded-md border border-black/10 bg-white shadow-sm"
      >
        <CommandInput
          placeholder={
            loadError
              ? "Unable to load location search"
              : isLoaded
                ? "Search location..."
                : "Loading location search..."
          }
          value={input}
          onValueChange={setInput}
          disabled={!isLoaded || Boolean(loadError)}
          className="pl-8 text-ash"
        />
        {predictions.length > 0 && (
          <CommandList className="absolute left-0 right-0 top-full z-100 max-h-60 overflow-y-auto border border-black/10 bg-white shadow-md">
            {predictions.map((prediction) => (
              <CommandItem
                key={prediction.place_id}
                value={prediction.description}
                onMouseDown={(event) => {
                  // Prevent input blur + cmdk value churn that forces a second click
                  event.preventDefault();
                  handleSelect(prediction);
                }}
                onSelect={() => handleSelect(prediction)}
                className="cursor-pointer text-ash"
              >
                {prediction.description}
              </CommandItem>
            ))}
          </CommandList>
        )}
      </Command>
      {loadError ? (
        <p className="mt-2 text-xs text-red-600">
          Location search failed to load. Check your Google Maps API key and
          enable Places API (New).
        </p>
      ) : null}
    </div>
  );
}
