import { usePwaInstall } from "../hooks/usePwaInstall";
import { Button } from "./ui/Button";

export function InstallHint() {
  const { canPrompt, install, dismiss } = usePwaInstall();

  if (!canPrompt) {
    return null;
  }

  return (
    <div
      className="mb-4 rounded-[var(--radius-app)] border border-border bg-surface px-4 py-3"
      role="region"
      aria-label="Install app"
    >
      <p className="text-[15px] font-medium text-text">Install Ride Compare</p>
      <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
        Add to your home screen for the fastest two-tap flow.
      </p>
      <div className="mt-3 flex gap-2">
        <Button type="button" variant="accent" className="flex-1" onClick={() => void install()}>
          Install
        </Button>
        <Button type="button" variant="secondary" className="flex-1" onClick={dismiss}>
          Not now
        </Button>
      </div>
    </div>
  );
}
