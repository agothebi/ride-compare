import {
  isValidLocation,
  type Location,
  type PickupLocation,
} from "../../types/location";

const LYFT_SCHEME_BASE = "lyft://ridetype";
const LYFT_WEB_FALLBACK_BASE = "https://ride.lyft.com/";

export function buildLyftUrl(
  pickup: PickupLocation,
  dropoff: Location,
): string {
  if (!Number.isFinite(pickup.lat) || !Number.isFinite(pickup.lng)) {
    throw new Error("Pickup must have lat and lng");
  }
  if (!isValidLocation(dropoff)) {
    throw new Error("Dropoff must have lat, lng, and a non-empty address");
  }

  const params = new URLSearchParams();
  params.set("id", "lyft");
  params.set("pickup[latitude]", String(pickup.lat));
  params.set("pickup[longitude]", String(pickup.lng));
  params.set("destination[latitude]", String(dropoff.lat));
  params.set("destination[longitude]", String(dropoff.lng));

  return `${LYFT_SCHEME_BASE}?${params.toString()}`;
}

/** Best-effort web fallback if the Lyft app does not open (verify on device in slice 3). */
export function buildLyftWebFallbackUrl(
  pickup: PickupLocation,
  dropoff: Location,
): string {
  if (!Number.isFinite(pickup.lat) || !Number.isFinite(pickup.lng)) {
    throw new Error("Pickup must have lat and lng");
  }
  if (!isValidLocation(dropoff)) {
    throw new Error("Dropoff must have lat, lng, and a non-empty address");
  }

  const params = new URLSearchParams();
  params.set("pickup[latitude]", String(pickup.lat));
  params.set("pickup[longitude]", String(pickup.lng));
  params.set("destination[latitude]", String(dropoff.lat));
  params.set("destination[longitude]", String(dropoff.lng));

  return `${LYFT_WEB_FALLBACK_BASE}?${params.toString()}`;
}
