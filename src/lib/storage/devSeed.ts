import type { Favorite, Location } from "../../types/location";
import { saveFavorites } from "./favorites";
import { saveRecents } from "./recents";

const seedDropoff: Location = {
  lat: 37.7699,
  lng: -122.4469,
  address: "1455 Market St, San Francisco, CA",
};

const seedFavorites: Favorite[] = [
  {
    label: "Home",
    lat: 37.7749,
    lng: -122.4194,
    address: "1 Dr Carlton B Goodlett Pl, San Francisco, CA",
  },
  {
    label: "Work",
    lat: 37.7896,
    lng: -122.3971,
    address: "415 Mission St, San Francisco, CA",
  },
];

/** Dev-only helper to populate localStorage for slice 6 UI testing. */
export function seedDevFavoritesAndRecents(): void {
  saveFavorites(seedFavorites);
  saveRecents([
    seedDropoff,
    {
      lat: 37.808,
      lng: -122.4177,
      address: "Pier 39, San Francisco, CA",
    },
  ]);
}
