import type { PickupLocation } from "../types/location";

export type GeolocationFailureReason =
  | "unsupported"
  | "permission_denied"
  | "position_unavailable"
  | "timeout"
  | "unknown";

export class GeolocationError extends Error {
  readonly reason: GeolocationFailureReason;

  constructor(reason: GeolocationFailureReason, message?: string) {
    super(message ?? reason);
    this.name = "GeolocationError";
    this.reason = reason;
  }
}

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 60_000,
};

function mapGeolocationError(error: GeolocationPositionError): GeolocationError {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return new GeolocationError(
        "permission_denied",
        "Location permission was denied",
      );
    case error.POSITION_UNAVAILABLE:
      return new GeolocationError(
        "position_unavailable",
        "Location is unavailable",
      );
    case error.TIMEOUT:
      return new GeolocationError("timeout", "Location request timed out");
    default:
      return new GeolocationError("unknown", error.message);
  }
}

/** Current-location pickup: lat/lng from device, empty address (Uber `pickup=my_location`). */
export function getCurrentPickup(): Promise<PickupLocation> {
  if (!navigator.geolocation) {
    return Promise.reject(
      new GeolocationError("unsupported", "Geolocation is not supported"),
    );
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: "",
        });
      },
      (error) => reject(mapGeolocationError(error)),
      GEO_OPTIONS,
    );
  });
}
