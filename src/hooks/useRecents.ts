import { useCallback, useState } from "react";
import type { Location } from "../types/location";
import { loadRecents, pushRecent } from "../lib/storage/recents";

export function useRecents() {
  const [recents, setRecents] = useState<Location[]>(() => loadRecents());

  const recordRecent = useCallback((location: Location) => {
    setRecents(pushRecent(location));
  }, []);

  const reload = useCallback(() => {
    setRecents(loadRecents());
  }, []);

  return { recents, recordRecent, reload };
}
