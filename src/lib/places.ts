import type { Location } from "../types/location";

export type PlacePredictionItem = {
  placeId: string;
  description: string;
  mainText: string;
};

export function toPlacePrediction(
  prediction: google.maps.places.AutocompletePrediction,
): PlacePredictionItem {
  return {
    placeId: prediction.place_id,
    description: prediction.description,
    mainText: prediction.structured_formatting.main_text,
  };
}

export function placeResultToLocation(
  place: google.maps.places.PlaceResult,
): Location | null {
  const lat = place.geometry?.location?.lat();
  const lng = place.geometry?.location?.lng();
  const address = place.formatted_address;

  if (
    lat === undefined ||
    lng === undefined ||
    !address ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return null;
  }

  return { lat, lng, address };
}

export function fetchPlacePredictions(
  input: string,
  sessionToken: google.maps.places.AutocompleteSessionToken,
): Promise<PlacePredictionItem[]> {
  return new Promise((resolve, reject) => {
    if (!input.trim()) {
      resolve([]);
      return;
    }

    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input, sessionToken },
      (predictions, status) => {
        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !predictions
        ) {
          if (
            status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS
          ) {
            resolve([]);
            return;
          }
          reject(new Error(`Places autocomplete failed: ${status}`));
          return;
        }
        resolve(predictions.map(toPlacePrediction));
      },
    );
  });
}

export function fetchPlaceDetails(
  placeId: string,
  sessionToken: google.maps.places.AutocompleteSessionToken,
  placesService: google.maps.places.PlacesService,
): Promise<Location | null> {
  return new Promise((resolve, reject) => {
    placesService.getDetails(
      {
        placeId,
        fields: ["geometry", "formatted_address"],
        sessionToken,
      },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
          reject(new Error(`Place details failed: ${status}`));
          return;
        }
        resolve(placeResultToLocation(place));
      },
    );
  });
}
