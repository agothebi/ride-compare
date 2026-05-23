import { useId, useRef, useState } from "react";
import type { Favorite, Location } from "../types/location";
import { usePlacesPredictions } from "../hooks/usePlacesPredictions";
import { AddressDropdown } from "./AddressDropdown";

type AddressFieldProps = {
  favorites: Favorite[];
  recents: Location[];
  canAddFavorite: boolean;
  destination: Location | null;
  onDestinationChange: (location: Location | null) => void;
  onSelectLocation: (location: Location) => void;
  onAddFavorite: () => void;
};

export function AddressField({
  favorites,
  recents,
  canAddFavorite,
  destination,
  onDestinationChange,
  onSelectLocation,
  onAddFavorite,
}: AddressFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [isResolving, setIsResolving] = useState(false);

  const isTyping = isFocused && query.length > 0;
  const showSavedList = isFocused && query.length === 0;
  const showDropdown = isFocused && (isTyping || showSavedList);

  const { predictions, isLoading, error, resolvePlace } = usePlacesPredictions(
    query,
    isTyping,
  );

  const displayValue =
    isFocused && query.length > 0
      ? query
      : (destination?.address ?? query);

  const handleChange = (value: string) => {
    setQuery(value);
    if (destination) {
      onDestinationChange(null);
    }
  };

  const handleSelect = (location: Location) => {
    onSelectLocation(location);
    setQuery("");
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleSelectPrediction = (placeId: string) => {
    setIsResolving(true);
    void resolvePlace(placeId)
      .then((location) => {
        if (location) {
          handleSelect(location);
        }
      })
      .finally(() => {
        setIsResolving(false);
      });
  };

  return (
    <div className="relative space-y-2">
      <label
        htmlFor={inputId}
        className="block text-[15px] font-medium text-text-muted"
      >
        Destination
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        value={displayValue}
        placeholder="Where to?"
        autoComplete="off"
        enterKeyHint="search"
        disabled={isResolving}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          window.setTimeout(() => setIsFocused(false), 150);
        }}
        onChange={(e) => handleChange(e.target.value)}
        className="min-h-12 w-full rounded-[var(--radius-app)] border border-border bg-surface-raised px-4 text-[17px] text-text outline-none transition-[border-color,box-shadow] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:opacity-60"
      />
      {showDropdown ? (
        <div className="absolute top-full z-10 mt-2 w-full">
          {isTyping ? (
            <AddressDropdown
              mode="predictions"
              predictions={predictions}
              isLoading={isLoading || isResolving}
              error={error}
              onSelectPrediction={handleSelectPrediction}
            />
          ) : (
            <AddressDropdown
              mode="saved"
              favorites={favorites}
              recents={recents}
              canAddFavorite={canAddFavorite}
              onSelect={handleSelect}
              onAddFavorite={onAddFavorite}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
