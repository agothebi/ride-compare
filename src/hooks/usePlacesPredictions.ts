import { useCallback, useEffect, useRef, useState } from "react";
import { loadGoogleMapsApi } from "../lib/maps";
import {
  fetchPlaceDetails,
  fetchPlacePredictions,
  type PlacePredictionItem,
} from "../lib/places";
import type { Location } from "../types/location";

export function usePlacesPredictions(query: string, enabled: boolean) {
  const [predictions, setPredictions] = useState<PlacePredictionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  const ensureSession = useCallback(async () => {
    const google = await loadGoogleMapsApi();
    if (!sessionTokenRef.current) {
      sessionTokenRef.current =
        new google.maps.places.AutocompleteSessionToken();
    }
    if (!placesServiceRef.current) {
      const anchor = document.createElement("div");
      placesServiceRef.current = new google.maps.places.PlacesService(anchor);
    }
    return google;
  }, []);

  useEffect(() => {
    if (!enabled || query.trim().length === 0) {
      setPredictions([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const handle = window.setTimeout(() => {
      setIsLoading(true);
      setError(null);

      void (async () => {
        try {
          await ensureSession();
          const results = await fetchPlacePredictions(
            query,
            sessionTokenRef.current!,
          );
          if (!cancelled) {
            setPredictions(results);
          }
        } catch (err) {
          if (!cancelled) {
            setPredictions([]);
            setError(
              err instanceof Error ? err.message : "Search unavailable",
            );
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [query, enabled, ensureSession]);

  const resolvePlace = useCallback(
    async (placeId: string): Promise<Location | null> => {
      const google = await ensureSession();
      const location = await fetchPlaceDetails(
        placeId,
        sessionTokenRef.current!,
        placesServiceRef.current!,
      );
      sessionTokenRef.current =
        new google.maps.places.AutocompleteSessionToken();
      return location;
    },
    [ensureSession],
  );

  return { predictions, isLoading, error, resolvePlace };
}
