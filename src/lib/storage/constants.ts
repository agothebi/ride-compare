export const MAX_FAVORITES = 6;
export const MAX_RECENTS = 6;

/** Last geolocation pickup shown instantly on reopen (PWA cold start). */
export const MAX_LAST_PICKUP_AGE_MS = 24 * 60 * 60 * 1000;

export const STORAGE_KEYS = {
  favorites: "ridecompare:favorites",
  recents: "ridecompare:recents",
  lastPickup: "ridecompare:last-pickup",
} as const;
