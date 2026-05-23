import { useEffect, useId, useState } from "react";
import type { Favorite, Location } from "../types/location";
import { MAX_FAVORITES } from "../lib/storage/constants";
import { usePlacesPredictions } from "../hooks/usePlacesPredictions";
import { AddressDropdown } from "./AddressDropdown";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

type FavoriteSheetProps = {
  open: boolean;
  onClose: () => void;
  onSave: (favorite: Favorite) => boolean;
  canAddMore: boolean;
};

export function FavoriteSheet({
  open,
  onClose,
  onSave,
  canAddMore,
}: FavoriteSheetProps) {
  const titleId = useId();
  const [label, setLabel] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const isSearching = addressQuery.trim().length > 0 && !selectedLocation;
  const { predictions, isLoading, error, resolvePlace } = usePlacesPredictions(
    addressQuery,
    open && isSearching,
  );

  useEffect(() => {
    if (!open) {
      setLabel("");
      setAddressQuery("");
      setSelectedLocation(null);
      setSaveError(null);
      setIsResolving(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleSelectPrediction = (placeId: string) => {
    setIsResolving(true);
    void resolvePlace(placeId)
      .then((location) => {
        if (location) {
          setSelectedLocation(location);
          setAddressQuery(location.address);
        }
      })
      .finally(() => {
        setIsResolving(false);
      });
  };

  const handleAddressChange = (value: string) => {
    setAddressQuery(value);
    setSelectedLocation(null);
    setSaveError(null);
  };

  const handleSave = () => {
    setSaveError(null);

    if (!canAddMore) {
      setSaveError(`You can save up to ${MAX_FAVORITES} favorites.`);
      return;
    }

    const trimmedLabel = label.trim();
    if (!trimmedLabel) {
      setSaveError("Enter a label, like Home or Work.");
      return;
    }

    if (!selectedLocation) {
      setSaveError("Pick an address from search results.");
      return;
    }

    const saved = onSave({
      label: trimmedLabel,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      address: selectedLocation.address,
    });

    if (saved) {
      onClose();
    } else {
      setSaveError(`You can save up to ${MAX_FAVORITES} favorites.`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[min(85dvh,560px)] w-full max-w-[430px] overflow-y-auto rounded-[var(--radius-app)] border border-border bg-surface p-5 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 id={titleId} className="text-[20px] font-semibold text-text">
              Add favorite
            </h2>
            <p className="mt-1 text-[15px] text-text-muted">
              Search for an address — map taps are not supported.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 min-w-12 rounded-[var(--radius-app)] text-[15px] text-text-muted active:bg-surface-raised"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <Input
            label="Label"
            placeholder="Home, Work, Gym…"
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              setSaveError(null);
            }}
            autoComplete="off"
          />

          <div className="space-y-2">
            <label
              htmlFor="favorite-address"
              className="block text-[15px] font-medium text-text-muted"
            >
              Address
            </label>
            <input
              id="favorite-address"
              type="text"
              value={addressQuery}
              placeholder="Search address"
              autoComplete="off"
              disabled={isResolving}
              onChange={(e) => handleAddressChange(e.target.value)}
              className="min-h-12 w-full rounded-[var(--radius-app)] border border-border bg-surface-raised px-4 text-[17px] text-text outline-none transition-[border-color,box-shadow] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:opacity-60"
            />
            {selectedLocation ? (
              <p className="text-[13px] text-text-muted">
                Selected: {selectedLocation.address}
              </p>
            ) : null}
            {isSearching ? (
              <AddressDropdown
                mode="predictions"
                predictions={predictions}
                isLoading={isLoading || isResolving}
                error={error}
                onSelectPrediction={handleSelectPrediction}
              />
            ) : null}
          </div>

          {saveError ? (
            <p className="text-[15px] text-[#ff6b6b]" role="alert">
              {saveError}
            </p>
          ) : null}

          <Button
            type="button"
            variant="accent"
            onClick={handleSave}
            disabled={!canAddMore || isResolving}
          >
            Save favorite
          </Button>
        </div>
      </div>
    </div>
  );
}
