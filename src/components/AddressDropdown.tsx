import type { Favorite, Location } from "../types/location";
import type { PlacePredictionItem } from "../lib/places";
import { MAX_FAVORITES } from "../lib/storage/constants";
import { DropdownRow } from "./DropdownRow";
import { Icon } from "./ui/Icon";

type AddressDropdownProps =
  | {
      mode: "saved";
      favorites: Favorite[];
      recents: Location[];
      canAddFavorite: boolean;
      onSelect: (location: Location) => void;
      onAddFavorite: () => void;
    }
  | {
      mode: "predictions";
      predictions: PlacePredictionItem[];
      isLoading: boolean;
      error: string | null;
      onSelectPrediction: (placeId: string) => void;
    };

export function AddressDropdown(props: AddressDropdownProps) {
  if (props.mode === "predictions") {
    const { predictions, isLoading, error, onSelectPrediction } = props;

    if (isLoading && predictions.length === 0) {
      return (
        <div
          className="rounded-[var(--radius-app)] border border-border bg-surface py-4 px-4"
          role="listbox"
          aria-label="Search results"
        >
          <p className="text-[15px] text-text-muted">Searching…</p>
        </div>
      );
    }

    if (error) {
      return (
        <div
          className="rounded-[var(--radius-app)] border border-border bg-surface py-4 px-4"
          role="listbox"
          aria-label="Search results"
        >
          <p className="text-[15px] text-text-muted">{error}</p>
        </div>
      );
    }

    if (predictions.length === 0) {
      return (
        <div
          className="rounded-[var(--radius-app)] border border-border bg-surface py-4 px-4"
          role="listbox"
          aria-label="Search results"
        >
          <p className="text-[15px] text-text-muted">No matching addresses</p>
        </div>
      );
    }

    return (
      <div
        className="overflow-hidden rounded-[var(--radius-app)] border border-border bg-surface"
        role="listbox"
        aria-label="Search results"
      >
        {predictions.map((prediction) => (
          <DropdownRow
            key={prediction.placeId}
            icon="pin"
            primary={prediction.mainText}
            secondary={prediction.description}
            onSelect={() => onSelectPrediction(prediction.placeId)}
          />
        ))}
      </div>
    );
  }

  const { favorites, recents, canAddFavorite, onSelect, onAddFavorite } = props;
  const hasFavorites = favorites.length > 0;
  const hasRecents = recents.length > 0;

  return (
    <div
      className="overflow-hidden rounded-[var(--radius-app)] border border-border bg-surface"
      role="listbox"
      aria-label="Saved places"
    >
      <section aria-label="Favorites">
        {hasFavorites
          ? favorites.map((favorite) => (
              <DropdownRow
                key={`${favorite.label}-${favorite.address}`}
                icon="heart"
                primary={favorite.label}
                secondary={favorite.address}
                onSelect={() => onSelect(favorite)}
              />
            ))
          : null}
        {canAddFavorite ? (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onAddFavorite}
            className="flex min-h-12 w-full items-center gap-3 border-t border-border px-4 py-2.5 text-left transition-colors active:bg-surface-raised"
          >
            <Icon name="heart" className="h-5 w-5 shrink-0 text-accent" />
            <span className="text-[17px] text-accent">Add a favorite</span>
          </button>
        ) : (
          <p className="border-t border-border px-4 py-3 text-[13px] text-text-muted">
            Favorites full ({MAX_FAVORITES} max)
          </p>
        )}
      </section>

      {hasRecents ? (
        <>
          <div className="border-t border-border" />
          <section aria-label="Recents">
            {recents.map((recent) => (
              <DropdownRow
                key={recent.address}
                icon="clock"
                primary={recent.address}
                onSelect={() => onSelect(recent)}
              />
            ))}
          </section>
        </>
      ) : !hasFavorites ? (
        <p className="border-t border-border px-4 py-3 text-[15px] text-text-muted">
          No recents yet. Type an address to search.
        </p>
      ) : null}
    </div>
  );
}
