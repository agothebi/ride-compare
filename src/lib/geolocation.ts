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

/** Cached / network fix — typically sub-second when a recent position exists. */
export const FAST_GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 4_000,
  maximumAge: 300_000,
};

/** GPS refinement for map and Lyft coords. */
export const REFINE_GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 12_000,
  maximumAge: 0,
};

const ACCURATE_FALLBACK_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 0,
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

function positionToPickup(position: GeolocationPosition): PickupLocation {
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    address: "",
  };
}

function getPosition(options: PositionOptions): Promise<PickupLocation> {
  if (!navigator.geolocation) {
    return Promise.reject(
      new GeolocationError("unsupported", "Geolocation is not supported"),
    );
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(positionToPickup(position)),
      (error) => reject(mapGeolocationError(error)),
      options,
    );
  });
}

/** Fast cached/network location for immediate pickup UI. */
export function getCurrentPickupFast(): Promise<PickupLocation> {
  return getPosition(FAST_GEO_OPTIONS);
}

/** High-accuracy GPS fix; call in background after fast pickup is shown. */
export function refineCurrentPickup(): Promise<PickupLocation> {
  return getPosition(REFINE_GEO_OPTIONS);
}

/** Haversine distance in meters between two lat/lng points. */
export function distanceMeters(
  a: PickupLocation,
  b: PickupLocation,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusM = 6_371_000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusM * Math.asin(Math.sqrt(h));
}

const REFINE_THRESHOLD_METERS = 50;

export function pickupMovedMeaningfully(
  previous: PickupLocation,
  next: PickupLocation,
): boolean {
  return distanceMeters(previous, next) > REFINE_THRESHOLD_METERS;
}

/**
 * Current-location pickup: fast fix first, high-accuracy fallback if fast fails.
 * Does not run GPS refine — use `refineCurrentPickup` in the hook for that.
 */
export function getCurrentPickup(): Promise<PickupLocation> {
  return getCurrentPickupFast().catch(() =>
    getPosition(ACCURATE_FALLBACK_OPTIONS),
  );
}
