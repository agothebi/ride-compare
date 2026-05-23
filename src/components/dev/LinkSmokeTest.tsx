import { buildLyftUrl, buildLyftWebFallbackUrl } from "../../lib/deepLinks/lyft";
import { openRide } from "../../lib/deepLinks/openRide";
import { buildUberUrl } from "../../lib/deepLinks/uber";
import {
  smokeTestDropoff,
  smokeTestPickup,
} from "../../data/smokeTestLocations";
import { seedDevFavoritesAndRecents } from "../../lib/storage/devSeed";
import { Button } from "../ui/Button";

const uberUrl = buildUberUrl(smokeTestPickup, smokeTestDropoff);
const lyftUrl = buildLyftUrl(smokeTestPickup, smokeTestDropoff);
const lyftFallbackUrl = buildLyftWebFallbackUrl(smokeTestPickup, smokeTestDropoff);

export function LinkSmokeTest() {
  return (
    <details className="rounded-[var(--radius-app)] border border-border bg-surface">
      <summary className="cursor-pointer list-none px-4 py-3 text-[15px] font-medium text-text [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          Test deep links
          <span className="text-text-muted" aria-hidden>
            ▾
          </span>
        </span>
      </summary>

      <div className="space-y-4 border-t border-border px-4 py-4">
        <p className="text-[15px] leading-relaxed text-text-muted">
          Hardcoded SF pickup (current location) → 1455 Market St. Test on a{" "}
          <strong className="font-medium text-text">real phone</strong> via a
          tapped link — not the iOS simulator or pasted URLs.
        </p>

        <dl className="space-y-2 text-[15px] text-text-muted">
          <div>
            <dt className="text-text">Pickup</dt>
            <dd>Current location ({smokeTestPickup.lat}, {smokeTestPickup.lng})</dd>
          </div>
          <div>
            <dt className="text-text">Dropoff</dt>
            <dd>{smokeTestDropoff.address}</dd>
          </div>
        </dl>

        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            seedDevFavoritesAndRecents();
            window.dispatchEvent(new Event("ridecompare:storage-updated"));
          }}
        >
          Seed favorites &amp; recents
        </Button>

        <div className="flex flex-col gap-3">
          <a
            href={uberUrl}
            className="flex min-h-12 items-center justify-center rounded-[var(--radius-app)] bg-black px-4 text-[17px] font-medium text-white transition-opacity active:opacity-80"
          >
            Open in Uber
          </a>
          <a
            href={lyftUrl}
            className="flex min-h-12 items-center justify-center rounded-[var(--radius-app)] bg-[#FF00BF] px-4 text-[17px] font-medium text-white transition-opacity active:opacity-80"
          >
            Open in Lyft
          </a>
          <button
            type="button"
            onClick={() => openRide(lyftUrl, lyftFallbackUrl)}
            className="flex min-h-12 items-center justify-center rounded-[var(--radius-app)] border border-border bg-surface-raised px-4 text-[15px] text-text-muted transition-colors active:bg-surface"
          >
            Lyft with web fallback (1.2s)
          </button>
        </div>

        <p className="text-[13px] leading-relaxed text-text-muted">
          Serve over HTTPS on your phone (deploy or tunnel). Local LAN:{" "}
          <code className="rounded bg-surface-raised px-1 py-0.5 text-[12px]">
            npm run dev -- --host
          </code>
        </p>
      </div>
    </details>
  );
}
