import { useEffect, useState } from "react";
import { AddressField } from "../components/AddressField";
import { FavoriteSheet } from "../components/FavoriteSheet";
import { InstallHint } from "../components/InstallHint";
import { PickupRow } from "../components/PickupRow";
import { RoutePreviewMap } from "../components/RoutePreviewMap";
import { ServiceButtons } from "../components/ServiceButtons";
import { useFavorites } from "../hooks/useFavorites";
import { usePickup } from "../hooks/usePickup";
import { useRecents } from "../hooks/useRecents";
import { isValidLocation, type Favorite, type Location } from "../types/location";

export function HomeScreen() {
  const { pickup, status, showManualPickup, setShowManualPickup, refresh } =
    usePickup();
  const { favorites, addFavorite, canAddMore, reload: reloadFavorites } =
    useFavorites();
  const { recents, recordRecent, reload: reloadRecents } = useRecents();
  const [destination, setDestination] = useState<Location | null>(null);
  const [favoriteSheetOpen, setFavoriteSheetOpen] = useState(false);

  const showTripPreview =
    pickup !== null && destination !== null && isValidLocation(destination);

  const handleSelectLocation = (location: Location) => {
    setDestination(location);
    recordRecent(location);
  };

  useEffect(() => {
    const onStorageUpdate = () => {
      reloadFavorites();
      reloadRecents();
    };
    window.addEventListener("ridecompare:storage-updated", onStorageUpdate);
    return () =>
      window.removeEventListener("ridecompare:storage-updated", onStorageUpdate);
  }, [reloadFavorites, reloadRecents]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="space-y-2 pb-6">
        <h1 className="text-[20px] font-semibold tracking-tight text-text">
          Ride Compare
        </h1>
        <p className="text-[15px] leading-relaxed text-text-muted">
          Pre-fill Uber or Lyft with your pickup and destination — no retyping.
        </p>
      </header>

      <InstallHint />

      <section className="space-y-4" aria-label="Trip details">
        <PickupRow
          status={status}
          showManualPickup={showManualPickup}
          onRequestManualPickup={() => setShowManualPickup(true)}
          onRetry={() => void refresh()}
        />
        <AddressField
          favorites={favorites}
          recents={recents}
          canAddFavorite={canAddMore}
          destination={destination}
          onDestinationChange={setDestination}
          onSelectLocation={handleSelectLocation}
          onAddFavorite={() => setFavoriteSheetOpen(true)}
        />
      </section>

      <FavoriteSheet
        open={favoriteSheetOpen}
        onClose={() => setFavoriteSheetOpen(false)}
        canAddMore={canAddMore}
        onSave={(favorite: Favorite) => addFavorite(favorite)}
      />

      {showTripPreview && pickup && destination ? (
        <div className="trip-preview-enter mt-6 space-y-6">
          <RoutePreviewMap pickup={pickup} destination={destination} />
          <ServiceButtons
            pickup={pickup}
            pickupStatus={status}
            destination={destination}
          />
        </div>
      ) : (
        <div className="mt-auto pt-8 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <ServiceButtons
            pickup={pickup}
            pickupStatus={status}
            destination={destination}
          />
        </div>
      )}
    </div>
  );
}
