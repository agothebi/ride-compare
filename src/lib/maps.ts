let loadPromise: Promise<typeof google> | null = null;

export function getMapsApiKey(): string {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key?.trim()) {
    throw new Error(
      "Missing VITE_GOOGLE_MAPS_API_KEY — add it to your .env file.",
    );
  }
  return key;
}

export function loadGoogleMapsApi(): Promise<typeof google> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser"));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const params = new URLSearchParams({
        key: getMapsApiKey(),
        libraries: "places",
        v: "weekly",
      });
      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.maps) {
          resolve(window.google);
        } else {
          reject(new Error("Google Maps failed to initialize"));
        }
      };
      script.onerror = () =>
        reject(new Error("Failed to load Google Maps JavaScript API"));
      document.head.appendChild(script);
    });
  }

  return loadPromise;
}
