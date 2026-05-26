import { useCallback, useEffect, useRef, useState } from "react";
import {
  GeolocationError,
  getCurrentPickup,
  pickupMovedMeaningfully,
  refineCurrentPickup,
} from "../lib/geolocation";
import { loadLastPickup, saveLastPickup } from "../lib/storage/lastPickup";
import type { PickupLocation } from "../types/location";

export type PickupStatus = "loading" | "ready" | "denied" | "error";

function getInitialPickup(): PickupLocation | null {
  return loadLastPickup();
}

export function usePickup() {
  const [pickup, setPickup] = useState<PickupLocation | null>(getInitialPickup);
  const [status, setStatus] = useState<PickupStatus>(() =>
    getInitialPickup() ? "ready" : "loading",
  );
  const [showManualPickup, setShowManualPickup] = useState(false);
  const refineGenerationRef = useRef(0);

  const refresh = useCallback(async () => {
    const generation = ++refineGenerationRef.current;
    const cachedAtStart = loadLastPickup();
    setShowManualPickup(false);

    if (!cachedAtStart) {
      setStatus("loading");
      setPickup(null);
    } else {
      setPickup(cachedAtStart);
      setStatus("ready");
    }

    try {
      const location = await getCurrentPickup();
      if (generation !== refineGenerationRef.current) return;

      saveLastPickup(location);
      setPickup(location);
      setStatus("ready");

      void refineCurrentPickup()
        .then((refined) => {
          if (generation !== refineGenerationRef.current) return;
          setPickup((previous) => {
            if (!previous || pickupMovedMeaningfully(previous, refined)) {
              saveLastPickup(refined);
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

      if (cachedAtStart) {
        setPickup(cachedAtStart);
        setStatus("ready");
        return;
      }

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
