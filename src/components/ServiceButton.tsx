import type { ServiceLaunch } from "../lib/serviceLaunch";
import { launchService } from "../lib/serviceLaunch";
import type { RideshareService } from "../lib/services";
import { Button } from "./ui/Button";

type ServiceButtonProps = {
  service: RideshareService;
  launch?: ServiceLaunch;
  disabled?: boolean;
};

export function ServiceButton({
  service,
  launch,
  disabled = true,
}: ServiceButtonProps) {
  const variant = service.id === "uber" ? "uber" : "lyft";
  const label = service.name;
  const isInteractive = !disabled && launch;

  const className =
    "flex min-h-12 w-full items-center justify-center rounded-[var(--radius-app)] px-4 text-[17px] font-medium transition-opacity duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)]";

  if (isInteractive && launch.kind === "link") {
    return (
      <a
        href={launch.href}
        className={`${className} bg-black text-white active:opacity-80`}
        aria-label={`Open ${label}`}
      >
        {label}
      </a>
    );
  }

  if (isInteractive && launch.kind === "lyft") {
    return (
      <button
        type="button"
        onClick={() => launchService(launch)}
        className={`${className} bg-[#FF00BF] text-white active:opacity-80`}
        aria-label={`Open ${label}`}
      >
        {label}
      </button>
    );
  }

  return (
    <Button variant={variant} disabled aria-label={`Open ${label}`}>
      {label}
    </Button>
  );
}
