export type Location = {
  lat: number;
  lng: number;
  address: string;
};

export type Favorite = Location & {
  label: string;
};

/** Pickup may omit a street address when sourced from Geolocation (current location). */
export type PickupLocation = Location;

export function isValidLocation(loc: Location): boolean {
  return (
    Number.isFinite(loc.lat) &&
    Number.isFinite(loc.lng) &&
    loc.address.trim().length > 0
  );
}

/** Geolocation pickup: lat/lng present, no formatted address — use Uber `pickup=my_location`. */
export function isCurrentLocationPickup(pickup: PickupLocation): boolean {
  return pickup.address.trim().length === 0;
}
