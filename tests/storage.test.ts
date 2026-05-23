import { beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_FAVORITES, MAX_RECENTS } from "../src/lib/storage/constants";
import {
  addFavorite,
  canAddFavorite,
  loadFavorites,
  saveFavorites,
} from "../src/lib/storage/favorites";
import { addRecent, loadRecents, saveRecents } from "../src/lib/storage/recents";
import type { Favorite, Location } from "../src/types/location";

const loc = (address: string, lat = 1, lng = 2): Location => ({
  lat,
  lng,
  address,
});

describe("favorites storage", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] ?? null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value;
      },
    });
  });

  it("caps favorites at MAX_FAVORITES", () => {
    const many: Favorite[] = Array.from({ length: 8 }, (_, i) => ({
      label: `Place ${i}`,
      ...loc(`Address ${i}`, i, i),
    }));
    saveFavorites(many);
    expect(loadFavorites()).toHaveLength(MAX_FAVORITES);
  });

  it("reports when favorites can be added", () => {
    expect(canAddFavorite([])).toBe(true);
    const full = Array.from({ length: MAX_FAVORITES }, (_, i) => ({
      label: `P${i}`,
      ...loc(`A${i}`),
    }));
    expect(canAddFavorite(full)).toBe(false);
  });

  it("addFavorite appends and persists", () => {
    const favorite = {
      label: "Home",
      ...loc("1 Dr Carlton B Goodlett Pl"),
    };
    const next = addFavorite([], favorite);
    expect(next).toHaveLength(1);
    expect(loadFavorites()[0].label).toBe("Home");
  });

  it("addFavorite throws when at cap", () => {
    const full = Array.from({ length: MAX_FAVORITES }, (_, i) => ({
      label: `P${i}`,
      ...loc(`A${i}`),
    }));
    expect(() =>
      addFavorite(full, { label: "Extra", ...loc("Extra St") }),
    ).toThrow(/maximum/i);
  });
});

describe("recents storage", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] ?? null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value;
      },
    });
  });

  it("dedupes by address and keeps most recent first", () => {
    const first = loc("1455 Market St");
    const updated = { ...first, lat: 37.77 };
    let recents = addRecent([], first);
    recents = addRecent(recents, updated);
    expect(recents).toHaveLength(1);
    expect(recents[0].lat).toBe(37.77);
  });

  it("caps recents at MAX_RECENTS", () => {
    let recents: Location[] = [];
    for (let i = 0; i < MAX_RECENTS + 2; i++) {
      recents = addRecent(recents, loc(`Place ${i}`, i, i));
    }
    saveRecents(recents);
    expect(loadRecents()).toHaveLength(MAX_RECENTS);
    expect(loadRecents()[0].address).toBe(`Place ${MAX_RECENTS + 1}`);
  });
});
