import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FAST_GEO_OPTIONS,
  GeolocationError,
  REFINE_GEO_OPTIONS,
  distanceMeters,
  getCurrentPickup,
  getCurrentPickupFast,
  pickupMovedMeaningfully,
  refineCurrentPickup,
} from "../src/lib/geolocation";

describe("getCurrentPickupFast", () => {
  const getCurrentPosition = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("navigator", {
      geolocation: { getCurrentPosition },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves lat/lng with empty address using fast options", async () => {
    getCurrentPosition.mockImplementation((success, _error, options) => {
      expect(options).toEqual(FAST_GEO_OPTIONS);
      success({
        coords: { latitude: 37.78, longitude: -122.4, accuracy: 500 },
      });
    });

    await expect(getCurrentPickupFast()).resolves.toEqual({
      lat: 37.78,
      lng: -122.4,
      address: "",
    });
  });

  it("rejects when geolocation is unsupported", async () => {
    vi.stubGlobal("navigator", {});

    await expect(getCurrentPickupFast()).rejects.toMatchObject({
      reason: "unsupported",
    });
  });

  it("maps permission denied", async () => {
    getCurrentPosition.mockImplementation((_success, error) => {
      error({ code: 1, PERMISSION_DENIED: 1, message: "denied" });
    });

    await expect(getCurrentPickupFast()).rejects.toMatchObject({
      name: "GeolocationError",
      reason: "permission_denied",
    });
  });
});

describe("refineCurrentPickup", () => {
  const getCurrentPosition = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("navigator", {
      geolocation: { getCurrentPosition },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses high-accuracy refine options", async () => {
    getCurrentPosition.mockImplementation((success, _error, options) => {
      expect(options).toEqual(REFINE_GEO_OPTIONS);
      success({
        coords: { latitude: 37.781, longitude: -122.401, accuracy: 10 },
      });
    });

    await expect(refineCurrentPickup()).resolves.toEqual({
      lat: 37.781,
      lng: -122.401,
      address: "",
    });
  });
});

describe("getCurrentPickup", () => {
  const getCurrentPosition = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("navigator", {
      geolocation: { getCurrentPosition },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("falls back to high-accuracy when fast fix fails", async () => {
    getCurrentPosition
      .mockImplementationOnce((_success, error) => {
        error({ code: 3, TIMEOUT: 3, message: "timeout" });
      })
      .mockImplementationOnce((success, _error, options) => {
        expect(options?.enableHighAccuracy).toBe(true);
        expect(options?.maximumAge).toBe(0);
        success({
          coords: { latitude: 37.79, longitude: -122.41, accuracy: 8 },
        });
      });

    await expect(getCurrentPickup()).resolves.toEqual({
      lat: 37.79,
      lng: -122.41,
      address: "",
    });
    expect(getCurrentPosition).toHaveBeenCalledTimes(2);
  });
});

describe("pickupMovedMeaningfully", () => {
  const base = { lat: 37.78, lng: -122.4, address: "" };

  it("returns false for small movement", () => {
    const nearby = { lat: 37.7801, lng: -122.4001, address: "" };
    expect(pickupMovedMeaningfully(base, nearby)).toBe(false);
    expect(distanceMeters(base, nearby)).toBeLessThan(50);
  });

  it("returns true for large movement", () => {
    const far = { lat: 37.79, lng: -122.4, address: "" };
    expect(pickupMovedMeaningfully(base, far)).toBe(true);
  });
});
