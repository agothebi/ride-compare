import type { Location } from "../../types/location";
import { isValidLocation } from "../../types/location";
import { MAX_RECENTS, STORAGE_KEYS } from "./constants";

function isLocation(value: unknown): value is Location {
  if (!value || typeof value !== "object") return false;
  return isValidLocation(value as Location);
}

export function loadRecents(): Location[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.recents);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isLocation).slice(0, MAX_RECENTS);
  } catch {
    return [];
  }
}

export function saveRecents(recents: Location[]): void {
  localStorage.setItem(STORAGE_KEYS.recents, JSON.stringify(recents));
}

/** Most recent first; dedupes by normalized address string. */
export function addRecent(recents: Location[], location: Location): Location[] {
  const key = location.address.trim().toLowerCase();
  const without = recents.filter(
    (r) => r.address.trim().toLowerCase() !== key,
  );
  return [location, ...without].slice(0, MAX_RECENTS);
}

export function pushRecent(location: Location): Location[] {
  const next = addRecent(loadRecents(), location);
  saveRecents(next);
  return next;
}
