# NOTES — Verified Deep Link Formats & Gotchas

> These formats were verified against Uber's and Lyft's official developer docs.
> The AI's memory of these APIs is unreliable — TRUST THIS FILE, not the model's
> recall. @-reference this file in Cursor prompts when touching link builders.

## Core types (TypeScript)
```ts
type Location = { lat: number; lng: number; address: string };
type Favorite = Location & { label: string };
```
A Location is only valid with all three fields. The `address` is the formatted
street address string from Google Places — required for Uber's dropoff param.

## Uber — use the Universal Link (recommended for a web app / PWA)

Base: `https://m.uber.com/ul/`

Parameters:
- `action=setPickup`
- `pickup[latitude]=...` & `pickup[longitude]=...`
  - OR set `pickup=my_location` to use current location (no lat/lng needed).
    This is our default for pickup.
- `dropoff[latitude]=...` & `dropoff[longitude]=...`
- `dropoff[formatted_address]=...`  <-- REQUIRED for the destination to actually
  appear in the app. Coordinates alone are NOT enough. (Or dropoff[nickname].)

Example:
https://m.uber.com/ul/?action=setPickup&pickup[latitude]=37.78&pickup[longitude]=-122.40&dropoff[latitude]=37.77&dropoff[longitude]=-122.41&dropoff[formatted_address]=1455%20Market%20St

Gotchas:
- Universal links are Uber's RECOMMENDED method from a non-native app (PWA).
  App installed -> opens app. Not installed -> opens m.uber.com web. No
  client-side install detection needed.
- ANDROID: destination may not appear until the user taps "Set Pickup Location"
  inside Uber. One unavoidable tap on Android. Not our bug. But, we will do our best to make it work.
- Cannot combine actions (e.g. promo + ride request) in one link.
- Universal links do NOT work in the iOS simulator or pasted into Safari's
  address bar — only via a tapped link on a physical device. Test on real phone.

## Lyft — two options

### Option A: raw scheme (full pre-fill, no signup) — RECOMMENDED for personal use
`lyft://ridetype?id=lyft&pickup[latitude]=...&pickup[longitude]=...&destination[latitude]=...&destination[longitude]=...`
- WARNING: Lyft uses `destination[...]`, NOT `dropoff[...]` like Uber. Easy to
  mix up — this is the #1 silent bug risk. The Location type helps, but the
  param NAME differs per builder.
- `id=lyft` is the standard ride type (others: lyft_line, lyft_plus, ...).
- Downside: raw scheme has no automatic web fallback if the app isn't installed
  — use the helper below.

### Option B: universal link (clean fallback, needs a Client ID)
`https://lyft.com/ride?id=lyft&partner=YOUR_CLIENT_ID`
- Requires the Lyft Developer Program to get a Client ID (the `partner` value).
- App installed -> opens app. Not installed -> auto-sends to ride.lyft.com web.
- Tradeoff: cleaner fallback, but documented universal-link params are sparse
  (id, partner) — less certain to carry full pickup+destination pre-fill than
  the raw scheme. For guaranteed pre-fill, Option A is more reliable.

DECISION: use Option A (raw scheme) + the fallback helper below. Lyft is
installed on your own phone anyway.

## Seamless fallback helper (only needed for raw schemes like lyft://)
Uber's m.uber.com/ul/ link needs NO fallback logic — the OS handles it.
Only Lyft's raw scheme needs this:

```ts
function openRide(appUrl: string, webFallbackUrl: string) {
  const timer = setTimeout(() => { window.location.href = webFallbackUrl; }, 1200);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearTimeout(timer); // app took over; cancel fallback
  }, { once: true });
  window.location.href = appUrl;
}
```

## Places autocomplete -> capture THREE things per location
lat, lng, AND the formatted address string. Need the address for Uber's
dropoff[formatted_address]. Never discard it. This is why favorites are created
THROUGH autocomplete, not from a map tap (a tap gives coords but no reliable
street address).

## Current location -> no reverse-geocoding needed
Geolocation gives lat/lng but no address. That's fine:
- Uber pickup: use pickup=my_location.
- Lyft pickup: lat/lng alone works.
Destination always carries an address (from autocomplete or a favorite), which
is the only spot Uber requires one. So we never reverse-geocode.

## Route preview map (confirmation step, AFTER input)
- Draw polyline pickup -> dropoff, fit bounds. Confidence check before launch.
- Use the Maps JS Directions/Polyline to render. Keep it static-ish: no
  draggable pins, no live traffic, no turn-by-turn. It is NOT the primary
  surface — service buttons sit right beside it.

## Google Maps API key (browser)
- Env: `VITE_GOOGLE_MAPS_API_KEY` in `.env` (copy from `.env.example`).
- Code: `import.meta.env.VITE_GOOGLE_MAPS_API_KEY` only — never a literal in source.
- GCP: Application restriction **Websites** → `http://localhost:5172/*` for local dev.
  Add production `https://your-domain.com/*` when deployed. API restriction: Maps
  JavaScript API + Places API only.
- Local dev URL: `http://localhost:5172` (Vite port 5172, `strictPort: true`).

## PWA reminders
- Fire links with window.location.href or a real <a href>. NOT window.open().
- PWA requires HTTPS — Vercel provides it automatically.
- Custom schemes (lyft://) hand off to the OS; they don't navigate the PWA, so
  app state is preserved in the background.

## Address-entry dropdown order (empty field, before typing)
1. Favorites (heart icon) — Home, Work, custom
2. Recents (clock icon) — last ~6 destinations
On first keystroke -> replace with Places autocomplete predictions.
