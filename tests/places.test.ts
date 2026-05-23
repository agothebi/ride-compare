import { describe, expect, it } from "vitest";
import { placeResultToLocation, toPlacePrediction } from "../src/lib/places";

describe("placeResultToLocation", () => {
  it("returns Location when geometry and formatted_address exist", () => {
    const result = placeResultToLocation({
      formatted_address: "1455 Market St, San Francisco, CA",
      geometry: {
        location: {
          lat: () => 37.77,
          lng: () => -122.41,
        },
      },
    } as google.maps.places.PlaceResult);

    expect(result).toEqual({
      lat: 37.77,
      lng: -122.41,
      address: "1455 Market St, San Francisco, CA",
    });
  });

  it("returns null when address or geometry is missing", () => {
    expect(placeResultToLocation({} as google.maps.places.PlaceResult)).toBeNull();
  });
});

describe("toPlacePrediction", () => {
  it("maps autocomplete prediction fields", () => {
    const item = toPlacePrediction({
      place_id: "abc123",
      description: "1455 Market St, San Francisco, CA, USA",
      structured_formatting: { main_text: "1455 Market St" },
    } as google.maps.places.AutocompletePrediction);

    expect(item).toEqual({
      placeId: "abc123",
      description: "1455 Market St, San Francisco, CA, USA",
      mainText: "1455 Market St",
    });
  });
});
