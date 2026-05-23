import { LinkSmokeTest } from "./components/dev/LinkSmokeTest";
import { AppShell } from "./components/layout/AppShell";
import { HomeScreen } from "./screens/HomeScreen";

export default function App() {
  return (
    <AppShell footer={import.meta.env.DEV ? <LinkSmokeTest /> : undefined}>
      <HomeScreen />
    </AppShell>
  );
}
