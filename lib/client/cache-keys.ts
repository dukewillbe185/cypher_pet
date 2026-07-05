import type { GardenZoneId } from "@/lib/types";

export const cacheKeys = {
  gardenSnapshot: (zoneId: GardenZoneId | string) => `garden:snapshot:${zoneId}`,
  gardenEvents: (zoneId: GardenZoneId | string) => `garden:events:${zoneId}`,
  chatSession: (petId: string) => `chat:session:${petId}`,
  petDetails: (petId: string) => `pet:details:${petId}`,
  viewerDashboard: (viewerId: string) => `viewer:dashboard:${viewerId}`,
  notifications: (viewerId: string) => `viewer:notifications:${viewerId}`,
} as const;
