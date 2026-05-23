import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GeolocationError, getCurrentPickup } from "../src/lib/geolocation";

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

  it("resolves lat/lng with empty address", async () => {
    getCurrentPosition.mockImplementation((success) => {
      success({
        coords: { latitude: 37.78, longitude: -122.4, accuracy: 10 },
      });
    });

    await expect(getCurrentPickup()).resolves.toEqual({
      lat: 37.78,
      lng: -122.4,
      address: "",
    });
  });

  it("rejects when geolocation is unsupported", async () => {
    vi.stubGlobal("navigator", {});

    await expect(getCurrentPickup()).rejects.toMatchObject({
      reason: "unsupported",
    });
  });

  it("maps permission denied", async () => {
    getCurrentPosition.mockImplementation((_success, error) => {
      error({ code: 1, PERMISSION_DENIED: 1, message: "denied" });
    });

    await expect(getCurrentPickup()).rejects.toMatchObject({
      name: "GeolocationError",
      reason: "permission_denied",
    });
  });
});
