import { describe, expect, it } from "vitest";
import { buildUberUrl } from "../src/lib/deepLinks/uber";
import type { Location, PickupLocation } from "../src/types/location";

const sfPickup: PickupLocation = {
  lat: 37.78,
  lng: -122.4,
  address: "",
};

const sfDropoff: Location = {
  lat: 37.77,
  lng: -122.41,
  address: "1455 Market St",
};

describe("buildUberUrl", () => {
  it("matches NOTES.md golden example with explicit pickup coordinates", () => {
    const pickup: PickupLocation = {
      lat: 37.78,
      lng: -122.4,
      address: "1 Market St",
    };
    const url = buildUberUrl(pickup, sfDropoff);

    expect(url).toBe(
      "https://m.uber.com/ul/?action=setPickup&pickup%5Blatitude%5D=37.78&pickup%5Blongitude%5D=-122.4&dropoff%5Blatitude%5D=37.77&dropoff%5Blongitude%5D=-122.41&dropoff%5Bformatted_address%5D=1455+Market+St",
    );
  });

  it("uses pickup=my_location when pickup has no address (current location)", () => {
    const url = buildUberUrl(sfPickup, sfDropoff);

    expect(url).toContain("pickup=my_location");
    expect(url).not.toContain("pickup%5Blatitude%5D");
    expect(url).toContain("dropoff%5Bformatted_address%5D=1455+Market+St");
  });

  it("URL-encodes special characters in dropoff address", () => {
    const dropoff: Location = {
      lat: 37.77,
      lng: -122.41,
      address: "1455 Market St, Suite #2",
    };
    const url = buildUberUrl(sfPickup, dropoff);

    expect(url).toContain(
      "dropoff%5Bformatted_address%5D=1455+Market+St%2C+Suite+%232",
    );
  });

  it("throws when dropoff address is missing", () => {
    expect(() =>
      buildUberUrl(sfPickup, { lat: 37.77, lng: -122.41, address: "  " }),
    ).toThrow(/address/i);
  });
});
