import type { Location, PickupLocation } from "../types/location";

/** Hardcoded SF route for slice 3 device smoke tests (matches NOTES.md-style coords). */
export const smokeTestPickup: PickupLocation = {
  lat: 37.7849,
  lng: -122.4094,
  address: "",
};

export const smokeTestDropoff: Location = {
  lat: 37.7699,
  lng: -122.4469,
  address: "1455 Market St, San Francisco, CA",
};
