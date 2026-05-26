import { useEffect } from "react";
import { LinkSmokeTest } from "./components/dev/LinkSmokeTest";
import { AppShell } from "./components/layout/AppShell";
import { loadGoogleMapsApi } from "./lib/maps";
import { HomeScreen } from "./screens/HomeScreen";

export default function App() {
  useEffect(() => {
    void loadGoogleMapsApi().catch(() => {
      // Key missing or blocked — AddressField / RoutePreviewMap surface errors.
    });
  }, []);

  return (
    <AppShell footer={import.meta.env.DEV ? <LinkSmokeTest /> : undefined}>
      <HomeScreen />
    </AppShell>
  );
}
