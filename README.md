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

## Build slices

See `.cursor/rules` and the implementation plan. Current: **slice 1** — installable empty PWA shell.
