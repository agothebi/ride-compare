import { useCallback, useState } from "react";
import type { Favorite } from "../types/location";
import {
  addFavorite as addFavoriteToStorage,
  canAddFavorite,
  loadFavorites,
} from "../lib/storage/favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>(() => loadFavorites());

  const reload = useCallback(() => {
    setFavorites(loadFavorites());
  }, []);

  const addFavorite = useCallback(
    (favorite: Favorite): boolean => {
      if (!canAddFavorite(favorites)) {
        return false;
      }
      try {
        const next = addFavoriteToStorage(favorites, favorite);
        setFavorites(next);
        return true;
      } catch {
        return false;
      }
    },
    [favorites],
  );

  return {
    favorites,
    addFavorite,
    canAddMore: canAddFavorite(favorites),
    reload,
  };
}
