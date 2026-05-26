import { useCallback, useEffect, useRef, useState } from "react";
import {
  GeolocationError,
  getCurrentPickup,
  pickupMovedMeaningfully,
  refineCurrentPickup,
} from "../lib/geolocation";
import type { PickupLocation } from "../types/location";

export type PickupStatus = "loading" | "ready" | "denied" | "error";

export function usePickup() {
  const [pickup, setPickup] = useState<PickupLocation | null>(null);
  const [status, setStatus] = useState<PickupStatus>("loading");
  const [showManualPickup, setShowManualPickup] = useState(false);
  const refineGenerationRef = useRef(0);

  const refresh = useCallback(async () => {
    const generation = ++refineGenerationRef.current;
    setStatus("loading");
    setShowManualPickup(false);

    try {
      const location = await getCurrentPickup();
      if (generation !== refineGenerationRef.current) return;

      setPickup(location);
      setStatus("ready");

      void refineCurrentPickup()
        .then((refined) => {
          if (generation !== refineGenerationRef.current) return;
          setPickup((previous) => {
            if (!previous || pickupMovedMeaningfully(previous, refined)) {
              return refined;
            }
            return previous;
          });
        })
        .catch(() => {
          // Fast fix is enough; refine is best-effort.
        });
    } catch (error) {
      if (generation !== refineGenerationRef.current) return;
      setPickup(null);
      if (
        error instanceof GeolocationError &&
        error.reason === "permission_denied"
      ) {
        setStatus("denied");
      } else {
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    pickup,
    status,
    showManualPickup,
    setShowManualPickup,
    refresh,
  };
}
