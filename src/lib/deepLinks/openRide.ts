const FALLBACK_DELAY_MS = 1200;

/**
 * Opens a raw app scheme (e.g. lyft://) and falls back to a web URL if the app
 * does not take over within 1200ms. Uber universal links do not need this.
 */
export function openRide(appUrl: string, webFallbackUrl: string): void {
  const timer = window.setTimeout(() => {
    window.location.href = webFallbackUrl;
  }, FALLBACK_DELAY_MS);

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        window.clearTimeout(timer);
      }
    },
    { once: true },
  );

  window.location.href = appUrl;
}

export { FALLBACK_DELAY_MS };
