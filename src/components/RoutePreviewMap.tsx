import { useEffect, useRef, useState } from "react";
import { loadGoogleMapsApi } from "../lib/maps";
import { darkMapStyles } from "../lib/mapStyles";
import type { Location, PickupLocation } from "../types/location";

type RoutePreviewMapProps = {
  pickup: PickupLocation;
  destination: Location;
};

function routePreviewErrorMessage(
  google: typeof globalThis.google,
  routeStatus?: string,
): string {
  if (routeStatus === google.maps.DirectionsStatus.REQUEST_DENIED) {
    return "Route preview blocked — enable Directions API on your Google Maps key";
  }
  if (routeStatus === google.maps.DirectionsStatus.ZERO_RESULTS) {
    return "No driving route found";
  }
  return "Could not load route preview";
}

export function RoutePreviewMap({ pickup, destination }: RoutePreviewMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    setStatus("loading");
    setErrorMessage(null);

    void (async () => {
      try {
        const google = await loadGoogleMapsApi();
        if (cancelled) return;

        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(container, {
            center: { lat: pickup.lat, lng: pickup.lng },
            zoom: 12,
            disableDefaultUI: true,
            gestureHandling: "none",
            draggable: false,
            clickableIcons: false,
            keyboardShortcuts: false,
            styles: darkMapStyles,
          });
        }

        if (!rendererRef.current) {
          rendererRef.current = new google.maps.DirectionsRenderer({
            map: mapRef.current,
            draggable: false,
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: "#5E9EFF",
              strokeWeight: 4,
              strokeOpacity: 0.9,
            },
          });
        }

        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
          {
            origin: { lat: pickup.lat, lng: pickup.lng },
            destination: { lat: destination.lat, lng: destination.lng },
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, routeStatus) => {
            if (cancelled) return;
            if (routeStatus !== google.maps.DirectionsStatus.OK || !result) {
              const message = routePreviewErrorMessage(google, routeStatus);
              if (import.meta.env.DEV) {
                console.warn("[RoutePreviewMap] Directions request failed", {
                  routeStatus,
                  message,
                });
              }
              setErrorMessage(message);
              setStatus("error");
              return;
            }
            rendererRef.current?.setDirections(result);
            setStatus("ready");
          },
        );
      } catch (error) {
        if (!cancelled) {
          const message = "Maps failed to load";
          if (import.meta.env.DEV) {
            console.warn("[RoutePreviewMap] Maps load failed", error);
          }
          setErrorMessage(message);
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pickup.lat, pickup.lng, destination.lat, destination.lng, destination.address]);

  return (
    <div className="space-y-2">
      <p className="text-[13px] font-medium text-text-muted">Route preview</p>
      <div
        className="relative overflow-hidden rounded-[var(--radius-app)] border border-border bg-surface"
        aria-busy={status === "loading"}
      >
        <div ref={containerRef} className="h-[200px] w-full" />
        {status === "loading" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 text-[15px] text-text-muted">
            Loading route…
          </div>
        ) : null}
        {status === "error" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 px-4 text-center text-[15px] text-text-muted">
            {errorMessage ?? "Could not load route preview"}
          </div>
        ) : null}
      </div>
    </div>
  );
}
