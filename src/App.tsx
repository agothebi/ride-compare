import { AppShell } from "./components/layout/AppShell";

export default function App() {
  return (
    <AppShell>
      <header className="space-y-2">
        <h1 className="text-[20px] font-semibold tracking-tight text-text">
          Ride Compare
        </h1>
        <p className="text-[15px] leading-relaxed text-text-muted">
          Pre-fill Uber or Lyft with your pickup and destination — no retyping.
        </p>
      </header>
    </AppShell>
  );
}
