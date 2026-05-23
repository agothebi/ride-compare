import { describe, expect, it } from "vitest";
import {
  canLaunchServices,
  getServiceLaunch,
} from "../src/lib/serviceLaunch";

const pickup = { lat: 37.78, lng: -122.4, address: "" };
const destination = {
  lat: 37.77,
  lng: -122.41,
  address: "1455 Market St",
};

describe("canLaunchServices", () => {
  it("requires pickup and valid destination", () => {
    expect(canLaunchServices(pickup, destination)).toBe(true);
    expect(canLaunchServices(null, destination)).toBe(false);
    expect(canLaunchServices(pickup, { ...destination, address: "" })).toBe(
      false,
    );
  });
});

describe("getServiceLaunch", () => {
  it("returns link launch for Uber", () => {
    const launch = getServiceLaunch("uber", pickup, destination);
    expect(launch.kind).toBe("link");
    if (launch.kind === "link") {
      expect(launch.href).toContain("m.uber.com");
    }
  });

  it("returns lyft launch with fallback for Lyft", () => {
    const launch = getServiceLaunch("lyft", pickup, destination);
    expect(launch.kind).toBe("lyft");
    if (launch.kind === "lyft") {
      expect(launch.appUrl.startsWith("lyft://")).toBe(true);
      expect(launch.webFallbackUrl).toContain("ride.lyft.com");
    }
  });
});
