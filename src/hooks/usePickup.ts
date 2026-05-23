import { useCallback, useEffect, useState } from "react";
import { GeolocationError, getCurrentPickup } from "../lib/geolocation";
import type { PickupLocation } from "../types/location";

export type PickupStatus = "loading" | "ready" | "denied" | "error";

export function usePickup() {
  const [pickup, setPickup] = useState<PickupLocation | null>(null);
  const [status, setStatus] = useState<PickupStatus>("loading");
  const [showManualPickup, setShowManualPickup] = useState(false);

  const refresh = useCallback(async () => {
    setStatus("loading");
    setShowManualPickup(false);

    try {
      const location = await getCurrentPickup();
      setPickup(location);
      setStatus("ready");
    } catch (error) {
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
