import {
  isCurrentLocationPickup,
  isValidLocation,
  type Location,
  type PickupLocation,
} from "../../types/location";

const UBER_BASE = "https://m.uber.com/ul/";

export function buildUberUrl(
  pickup: PickupLocation,
  dropoff: Location,
): string {
  if (!isValidLocation(dropoff)) {
    throw new Error("Dropoff must have lat, lng, and a non-empty address");
  }

  const params = new URLSearchParams();
  params.set("action", "setPickup");

  if (isCurrentLocationPickup(pickup)) {
    params.set("pickup", "my_location");
  } else {
    if (!Number.isFinite(pickup.lat) || !Number.isFinite(pickup.lng)) {
      throw new Error("Pickup must have lat and lng when not using my_location");
    }
    params.set("pickup[latitude]", String(pickup.lat));
    params.set("pickup[longitude]", String(pickup.lng));
  }

  params.set("dropoff[latitude]", String(dropoff.lat));
  params.set("dropoff[longitude]", String(dropoff.lng));
  params.set("dropoff[formatted_address]", dropoff.address);

  return `${UBER_BASE}?${params.toString()}`;
}
