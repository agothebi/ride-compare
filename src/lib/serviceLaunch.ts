import { buildLyftUrl, buildLyftWebFallbackUrl } from "./deepLinks/lyft";
import { openRide } from "./deepLinks/openRide";
import { buildUberUrl } from "./deepLinks/uber";
import type { RideshareServiceId } from "./services";
import {
  isValidLocation,
  type Location,
  type PickupLocation,
} from "../types/location";

export type ServiceLaunch =
  | { kind: "link"; href: string }
  | { kind: "lyft"; appUrl: string; webFallbackUrl: string };

export function getServiceLaunch(
  serviceId: RideshareServiceId,
  pickup: PickupLocation,
  destination: Location,
): ServiceLaunch {
  if (serviceId === "uber") {
    return { kind: "link", href: buildUberUrl(pickup, destination) };
  }
  return {
    kind: "lyft",
    appUrl: buildLyftUrl(pickup, destination),
    webFallbackUrl: buildLyftWebFallbackUrl(pickup, destination),
  };
}

export function launchService(launch: ServiceLaunch): void {
  if (launch.kind === "link") {
    window.location.href = launch.href;
    return;
  }
  openRide(launch.appUrl, launch.webFallbackUrl);
}

export function canLaunchServices(
  pickup: PickupLocation | null,
  destination: Location | null,
): destination is Location {
  return pickup !== null && destination !== null && isValidLocation(destination);
}
