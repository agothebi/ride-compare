import type { PickupLocation } from "../../types/location";
import { isCurrentLocationPickup } from "../../types/location";
import { MAX_LAST_PICKUP_AGE_MS, STORAGE_KEYS } from "./constants";

type StoredLastPickup = {
  lat: number;
  lng: number;
  savedAt: number;
};

function isValidCoords(lat: unknown, lng: unknown): lat is number {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function isStoredLastPickup(value: unknown): value is StoredLastPickup {
  if (!value || typeof value !== "object") return false;
  const entry = value as StoredLastPickup;
  return (
    isValidCoords(entry.lat, entry.lng) &&
    typeof entry.savedAt === "number" &&
    Number.isFinite(entry.savedAt)
  );
}

export function loadLastPickup(): PickupLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.lastPickup);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isStoredLastPickup(parsed)) return null;

    if (Date.now() - parsed.savedAt > MAX_LAST_PICKUP_AGE_MS) {
      return null;
    }

    return {
      lat: parsed.lat,
      lng: parsed.lng,
      address: "",
    };
  } catch {
    return null;
  }
}

export function saveLastPickup(pickup: PickupLocation): void {
  if (!isCurrentLocationPickup(pickup)) return;
  if (!isValidCoords(pickup.lat, pickup.lng)) return;

  const stored: StoredLastPickup = {
    lat: pickup.lat,
    lng: pickup.lng,
    savedAt: Date.now(),
  };

  localStorage.setItem(STORAGE_KEYS.lastPickup, JSON.stringify(stored));
}
