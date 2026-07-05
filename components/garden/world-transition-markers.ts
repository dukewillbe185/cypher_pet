import type { GardenSnapshot, GardenZoneId } from "@/lib/types";

export type WorldTransitionMarker = {
  id: string;
  eventId: string;
  petId: string;
  petName: string;
  zoneId: GardenZoneId;
  tileX: number;
  tileY: number;
  offsetX: number;
  offsetY: number;
  title: string;
  summary: string;
};

function markerOffset(index: number) {
  const row = Math.floor(index / 3);

  switch (index % 3) {
    case 1:
      return { offsetX: 48, offsetY: -10 - row * 24 };
    case 2:
      return { offsetX: -48, offsetY: -10 - row * 24 };
    default:
      return { offsetX: 0, offsetY: -18 - row * 24 };
  }
}

export function buildWorldTransitionMarkers(snapshot: GardenSnapshot): WorldTransitionMarker[] {
  const petsById = new Map(snapshot.pets.map((pet) => [pet.pet.id, pet]));
  const seenPetIds = new Set<string>();
  const tileCounts = new Map<string, number>();

  return snapshot.recentEvents
    .filter((event) => event.type === "zone_move" && event.zoneId === snapshot.zone.id && !event.hidden)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .map((event): WorldTransitionMarker | null => {
      const pet = petsById.get(event.petId);

      if (!pet || seenPetIds.has(pet.pet.id)) {
        return null;
      }

      seenPetIds.add(pet.pet.id);
      const tileKey = `${pet.state.tileX}:${pet.state.tileY}`;
      const tileIndex = tileCounts.get(tileKey) ?? 0;
      tileCounts.set(tileKey, tileIndex + 1);
      const offset = markerOffset(tileIndex);

      return {
        id: `transition:${event.id}`,
        eventId: event.id,
        petId: pet.pet.id,
        petName: pet.pet.name,
        zoneId: snapshot.zone.id,
        tileX: pet.state.tileX,
        tileY: pet.state.tileY,
        offsetX: offset.offsetX,
        offsetY: offset.offsetY,
        title: `${pet.pet.name} 到达${snapshot.zone.name}`,
        summary: event.body,
      };
    })
    .filter((marker): marker is WorldTransitionMarker => marker !== null);
}
