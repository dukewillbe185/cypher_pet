import type { GardenSnapshot } from "@/lib/types";

export function mergeCurrentZoneSnapshot(
  worldSnapshots: GardenSnapshot[],
  currentSnapshot: GardenSnapshot,
): GardenSnapshot[] {
  let replaced = false;
  const merged = worldSnapshots.map((snapshot) => {
    if (snapshot.zone.id !== currentSnapshot.zone.id) {
      return snapshot;
    }

    replaced = true;
    return currentSnapshot;
  });

  return replaced ? merged : [...merged, currentSnapshot];
}
