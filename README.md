# Ride Compare

Dark-mode PWA that opens Uber or Lyft with pickup and destination pre-filled via deep links.

## Setup

1. Copy `.env.example` to `.env` and set `VITE_GOOGLE_MAPS_API_KEY`.
2. In Google Cloud Console, restrict the key:
   - **Websites:** `http://localhost:5172/*` (and your production domain when deployed)
   - **APIs:** Maps JavaScript API + Places API only
3. `npm install`
4. `npm run dev` → http://localhost:5172

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 5172) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Run deep-link unit tests (Vitest) |

## Build slices

Ride Compare PWA — vertical slices 0–9 complete.

## Happy path

1. Allow location (pickup defaults to current location).
2. Tap **Destination** → pick a **favorite** or search an address.
3. Glance at the **route preview** → tap **Uber** or **Lyft** (Lyft uses app open + web fallback).

Install from the browser prompt when offered, or use **Add to Home Screen** on iOS.

### Google Maps on your phone

If testing over LAN (`npm run dev -- --host`), add your network URL to the API key **Websites** restriction, e.g. `http://192.168.1.x:5172/*`, in addition to `http://localhost:5172/*`.

### Slice 3 — test on your phone

1. Expand **Test deep links** on the home screen.
2. Tap **Open in Uber** or **Open in Lyft** (must be a tap, not copy-paste into Safari).
3. For Lyft fallback behavior, use **Lyft with web fallback**.
4. Local phone on same Wi‑Fi: `npm run dev -- --host`, then open `http://<your-mac-ip>:5172`.
