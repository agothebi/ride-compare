import { describe, expect, it } from "vitest";
import {
  isCurrentLocationPickup,
  isValidLocation,
} from "../src/types/location";

describe("isValidLocation", () => {
  it("returns true when lat, lng, and address are present", () => {
    expect(
      isValidLocation({ lat: 1, lng: 2, address: "1455 Market St" }),
    ).toBe(true);
  });

  it("returns false when address is empty or whitespace", () => {
    expect(isValidLocation({ lat: 1, lng: 2, address: "" })).toBe(false);
    expect(isValidLocation({ lat: 1, lng: 2, address: "   " })).toBe(false);
  });
});

describe("isCurrentLocationPickup", () => {
  it("returns true when address is empty", () => {
    expect(isCurrentLocationPickup({ lat: 37.78, lng: -122.4, address: "" })).toBe(
      true,
    );
  });

  it("returns false when address is set", () => {
    expect(
      isCurrentLocationPickup({
        lat: 37.78,
        lng: -122.4,
        address: "1 Market St",
      }),
    ).toBe(false);
  });
});
