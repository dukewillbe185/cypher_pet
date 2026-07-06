import type { AppStore, GardenZone, GardenZoneId, Pet } from "@/lib/types";

export const BUILTIN_ZONE_IDS = ["orchard", "pond", "grove", "dog-run"] as const;
export const MAX_CUSTOM_ZONES_PER_USER = 4;

export function isBuiltinZoneId(zoneId: GardenZoneId) {
  return (BUILTIN_ZONE_IDS as readonly string[]).includes(zoneId);
}

export function zoneVisibility(zone: GardenZone | undefined) {
  return zone?.visibility ?? "public";
}

export function findZone(store: AppStore, zoneId: GardenZoneId) {
  return store.gardenZones.find((zone) => zone.id === zoneId);
}

/** Whether a signed-in (or anonymous) viewer may see and enter a zone. */
export function canViewerAccessZone(zone: GardenZone | undefined, viewerId?: string) {
  if (!zone) {
    return false;
  }

  if (zoneVisibility(zone) === "public") {
    return true;
  }

  return Boolean(viewerId && zone.ownerId === viewerId);
}

/** Whether a pet may roam into or be sent into a zone. */
export function canPetEnterZone(store: AppStore, pet: Pet, zoneId: GardenZoneId) {
  const zone = findZone(store, zoneId);

  if (!zone) {
    return false;
  }

  if (zoneVisibility(zone) === "public") {
    return true;
  }

  return zone.ownerId === pet.ownerId;
}

/** Zones the viewer can open: built-ins, public custom areas, own areas. */
export function listAccessibleZones(store: AppStore, viewerId?: string) {
  return store.gardenZones.filter((zone) => canViewerAccessZone(zone, viewerId));
}

export function countCustomZonesOwnedBy(store: AppStore, ownerId: string) {
  return store.gardenZones.filter((zone) => zone.ownerId === ownerId).length;
}
