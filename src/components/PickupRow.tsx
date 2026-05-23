import type { PickupStatus } from "../hooks/usePickup";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Input } from "./ui/Input";

type PickupRowProps = {
  status: PickupStatus;
  showManualPickup: boolean;
  onRequestManualPickup: () => void;
  onRetry: () => void;
};

function statusCopy(status: PickupStatus): { title: string; detail?: string } {
  switch (status) {
    case "loading":
      return { title: "Finding your location…" };
    case "ready":
      return { title: "Current location" };
    case "denied":
      return {
        title: "Location access off",
        detail: "Enable location or set pickup manually.",
      };
    case "error":
      return {
        title: "Couldn't get location",
        detail: "Check connection and try again.",
      };
  }
}

export function PickupRow({
  status,
  showManualPickup,
  onRequestManualPickup,
  onRetry,
}: PickupRowProps) {
  const { title, detail } = statusCopy(status);
  const needsAction = status === "denied" || status === "error";

  if (showManualPickup && needsAction) {
    return (
      <div className="space-y-3">
        <Input
          label="Pickup"
          placeholder="Search for pickup"
          disabled
        />
        <p className="text-[13px] leading-relaxed text-text-muted">
          Pickup search is not available yet. Allow location access or try again.
        </p>
        <Button variant="secondary" onClick={onRetry}>
          Use current location
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={`flex min-h-12 items-center gap-3 rounded-[var(--radius-app)] border border-border bg-surface px-4 ${status === "loading" ? "opacity-80" : ""}`}
        aria-busy={status === "loading"}
      >
        <Icon
          name="pin"
          className={`h-5 w-5 shrink-0 ${status === "ready" ? "text-accent" : "text-text-muted"}`}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-text-muted">Pickup</p>
          <p className="truncate text-[17px] text-text">{title}</p>
          {detail ? (
            <p className="mt-0.5 text-[13px] leading-snug text-text-muted">
              {detail}
            </p>
          ) : null}
        </div>
      </div>

      {needsAction ? (
        <div className="flex flex-col gap-2">
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
          {status === "denied" ? (
            <button
              type="button"
              onClick={onRequestManualPickup}
              className="min-h-12 text-[15px] text-accent transition-opacity active:opacity-70"
            >
              Set pickup manually
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
