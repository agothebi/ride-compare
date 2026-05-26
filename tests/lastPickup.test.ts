import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_LAST_PICKUP_AGE_MS, STORAGE_KEYS } from "../src/lib/storage/constants";
import { loadLastPickup, saveLastPickup } from "../src/lib/storage/lastPickup";
import type { PickupLocation } from "../src/types/location";

const pickup = (lat = 37.78, lng = -122.4, address = ""): PickupLocation => ({
  lat,
  lng,
  address,
});

describe("lastPickup storage", () => {
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
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-25T12:00:00Z"));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("round-trips save and load", () => {
    saveLastPickup(pickup(37.78, -122.4));
    expect(loadLastPickup()).toEqual(pickup(37.78, -122.4));
  });

  it("returns null for invalid JSON", () => {
    localStorage.setItem(STORAGE_KEYS.lastPickup, "not-json");
    expect(loadLastPickup()).toBeNull();
  });

  it("returns null for invalid coords", () => {
    localStorage.setItem(
      STORAGE_KEYS.lastPickup,
      JSON.stringify({ lat: 999, lng: 0, savedAt: Date.now() }),
    );
    expect(loadLastPickup()).toBeNull();
  });

  it("returns null when cache is older than 24 hours", () => {
    const savedAt = Date.now() - MAX_LAST_PICKUP_AGE_MS - 1;
    localStorage.setItem(
      STORAGE_KEYS.lastPickup,
      JSON.stringify({ lat: 37.78, lng: -122.4, savedAt }),
    );
    expect(loadLastPickup()).toBeNull();
  });

  it("does not save pickups with a street address", () => {
    saveLastPickup(pickup(37.78, -122.4, "1455 Market St"));
    expect(localStorage.getItem(STORAGE_KEYS.lastPickup)).toBeNull();
  });
});
