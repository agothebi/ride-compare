import type { Favorite } from "../../types/location";
import { isValidLocation } from "../../types/location";
import { MAX_FAVORITES, STORAGE_KEYS } from "./constants";

function isFavorite(value: unknown): value is Favorite {
  if (!value || typeof value !== "object") return false;
  const f = value as Favorite;
  return (
    typeof f.label === "string" &&
    f.label.trim().length > 0 &&
    isValidLocation(f)
  );
}

export function loadFavorites(): Favorite[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.favorites);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isFavorite).slice(0, MAX_FAVORITES);
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: Favorite[]): void {
  const trimmed = favorites.slice(0, MAX_FAVORITES);
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(trimmed));
}

export function canAddFavorite(favorites: Favorite[]): boolean {
  return favorites.length < MAX_FAVORITES;
}

export function addFavorite(
  favorites: Favorite[],
  favorite: Favorite,
): Favorite[] {
  if (!canAddFavorite(favorites)) {
    throw new Error(`Maximum of ${MAX_FAVORITES} favorites allowed`);
  }
  const label = favorite.label.trim();
  if (!label) {
    throw new Error("Favorite label is required");
  }
  if (!isValidLocation(favorite)) {
    throw new Error("Favorite must include a valid address from search");
  }
  const next: Favorite[] = [
    ...favorites,
    { ...favorite, label },
  ];
  saveFavorites(next);
  return next;
}
