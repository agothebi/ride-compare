import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { buildLyftUrl, buildLyftWebFallbackUrl } from "../src/lib/deepLinks/lyft";
import {
  FALLBACK_DELAY_MS,
  openRide,
} from "../src/lib/deepLinks/openRide";
import type { Location, PickupLocation } from "../src/types/location";

const pickup: PickupLocation = {
  lat: 37.7849,
  lng: -122.4094,
  address: "",
};

const dropoff: Location = {
  lat: 37.7699,
  lng: -122.4469,
  address: "1455 Market St",
};

describe("buildLyftUrl", () => {
  it("uses lyft:// scheme with id=lyft and destination params (not dropoff)", () => {
    const url = buildLyftUrl(pickup, dropoff);

    expect(url.startsWith("lyft://ridetype?")).toBe(true);
    expect(url).toContain("id=lyft");
    expect(url).toContain("pickup%5Blatitude%5D=37.7849");
    expect(url).toContain("pickup%5Blongitude%5D=-122.4094");
    expect(url).toContain("destination%5Blatitude%5D=37.7699");
    expect(url).toContain("destination%5Blongitude%5D=-122.4469");
    expect(url).not.toContain("dropoff");
  });

  it("works with geolocation-style pickup (empty address, lat/lng present)", () => {
    const url = buildLyftUrl(
      { lat: 37.78, lng: -122.4, address: "" },
      dropoff,
    );
    expect(url).toContain("pickup%5Blatitude%5D=37.78");
    expect(url).not.toContain("destination%5Bformatted_address%5D");
  });
});

describe("buildLyftWebFallbackUrl", () => {
  it("targets ride.lyft.com with destination params", () => {
    const url = buildLyftWebFallbackUrl(pickup, dropoff);

    expect(url.startsWith("https://ride.lyft.com/?")).toBe(true);
    expect(url).toContain("destination%5Blatitude%5D=");
    expect(url).not.toContain("dropoff");
  });
});

describe("openRide", () => {
  let href = "";

  beforeEach(() => {
    vi.useFakeTimers();
    href = "";
    Object.defineProperty(window, "location", {
      value: {
        get href() {
          return href;
        },
        set href(value: string) {
          href = value;
        },
      },
      writable: true,
      configurable: true,
    });
    Object.defineProperty(document, "hidden", {
      value: false,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("navigates to app URL immediately and web fallback after delay", () => {
    openRide("lyft://test", "https://ride.lyft.com/fallback");
    expect(href).toBe("lyft://test");

    vi.advanceTimersByTime(FALLBACK_DELAY_MS);
    expect(href).toBe("https://ride.lyft.com/fallback");
  });

  it("cancels fallback when document becomes hidden", () => {
    openRide("lyft://test", "https://ride.lyft.com/fallback");
    expect(href).toBe("lyft://test");

    Object.defineProperty(document, "hidden", { value: true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));

    vi.advanceTimersByTime(FALLBACK_DELAY_MS);
    expect(href).toBe("lyft://test");
  });
});
