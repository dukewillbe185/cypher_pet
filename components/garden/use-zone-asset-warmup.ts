"use client";

import { useEffect } from "react";

import { schedulePrefetch } from "@/lib/client/prefetch";
import { buildPetFrameUrls } from "@/lib/rendering/pet-sprite-frames";
import type { GardenPetSnapshot, GardenZoneId, Species } from "@/lib/types";

const backgroundScenePath: Record<GardenZoneId, string> = {
  orchard: "/garden/scene-orchard.svg",
  pond: "/garden/scene-pond.svg",
  grove: "/garden/scene-grove.svg",
  "dog-run": "/garden/scene-dog-run.svg",
};

const orderedZones: GardenZoneId[] = ["orchard", "grove", "pond", "dog-run"];

function nearbyZones(zoneId: GardenZoneId) {
  const index = orderedZones.indexOf(zoneId);

  if (index === -1) {
    return [zoneId];
  }

  return [
    zoneId,
    orderedZones[(index + 1) % orderedZones.length],
    orderedZones[(index - 1 + orderedZones.length) % orderedZones.length],
  ];
}

function warmImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

async function warmPetFrames(spritePath: string, species: Species) {
  const response = await fetch(spritePath, { cache: "force-cache" });
  const svgText = await response.text();
  const frameUrls = buildPetFrameUrls(svgText, species);
  const warmTargets = [
    ...frameUrls.rest.slice(0, 2),
    ...frameUrls.amble.slice(0, 2),
    ...frameUrls.trot.slice(0, 1),
  ];

  await Promise.all(warmTargets.map((src) => warmImage(src)));
}

export function useZoneAssetWarmup(zoneId: GardenZoneId, pets: GardenPetSnapshot[]) {
  useEffect(() => {
    for (const candidateZoneId of nearbyZones(zoneId)) {
      schedulePrefetch({
        key: `garden-background:${candidateZoneId}`,
        priority: candidateZoneId === zoneId ? "visible" : "idle",
        run: () => warmImage(backgroundScenePath[candidateZoneId]),
      });
    }

    for (const pet of pets.slice(0, 4)) {
      const spritePath = pet.generation.worldSpritePath;

      if (!spritePath) {
        continue;
      }

      schedulePrefetch({
        key: `garden-pet-frames:${pet.pet.species}:${spritePath}`,
        priority: "idle",
        run: () => warmPetFrames(spritePath, pet.pet.species),
      });
    }
  }, [pets, zoneId]);
}
