import type { PickupStatus } from "../hooks/usePickup";
import {
  canLaunchServices,
  getServiceLaunch,
} from "../lib/serviceLaunch";
import { rideshareServices } from "../lib/services";
import type { Location, PickupLocation } from "../types/location";
import { ServiceButton } from "./ServiceButton";

type ServiceButtonsProps = {
  pickup: PickupLocation | null;
  pickupStatus: PickupStatus;
  destination: Location | null;
};

function statusHint(
  pickup: PickupLocation | null,
  pickupStatus: PickupStatus,
  destination: Location | null,
): string {
  if (canLaunchServices(pickup, destination)) {
    return "Choose a service";
  }
  if (!pickup) {
    if (pickupStatus === "loading") {
      return "Waiting for your location…";
    }
    if (pickupStatus === "denied") {
      return "Allow location access to compare rides";
    }
    return "Set pickup to compare rides";
  }
  return "Enter a destination to compare rides";
}

export function ServiceButtons({
  pickup,
  pickupStatus,
  destination,
}: ServiceButtonsProps) {
  const ready = canLaunchServices(pickup, destination);

  return (
    <div className="space-y-3">
      <p className="text-center text-[13px] text-text-muted">
        {statusHint(pickup, pickupStatus, destination)}
      </p>
      <div className="flex flex-col gap-3">
        {rideshareServices.map((service) => (
          <ServiceButton
            key={service.id}
            service={service}
            launch={
              ready && pickup && destination
                ? getServiceLaunch(service.id, pickup, destination)
                : undefined
            }
            disabled={!ready}
          />
        ))}
      </div>
    </div>
  );
}
