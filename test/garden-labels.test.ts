import { describe, expect, it } from "vitest";

import {
  activityLabel,
  activityTone,
  buildIntentSummary,
  goalLabel,
  relationshipPulse,
} from "@/components/garden/garden-labels";
import type { GardenPetSnapshot } from "@/lib/types";

const now = "2026-06-28T00:00:00.000Z";

const basePet = {
  pet: {
    id: "pet-1",
    ownerId: "owner-1",
    name: "Miso",
    species: "cat",
    breed: "calico",
    bio: "watches everything",
    visibility: "public",
    activeGenerationId: "gen-1",
    isFrozen: false,
    createdAt: now,
  },
  generation: {
    id: "gen-1",
    petId: "pet-1",
    sourcePhotoId: "photo-1",
    providerJobId: "job-1",
    status: "succeeded",
    promptSeed: "seed",
    worldSpritePath: "/generated/miso.svg",
    appearanceSeed: "appearance",
    paletteName: "lime",
    attempts: 1,
    createdAt: now,
    updatedAt: now,
  },
  owner: {
    id: "owner-1",
    email: "owner@example.com",
    handle: "owner",
    displayName: "Owner",
    bio: "",
    role: "user",
    createdAt: now,
  },
  state: {
    petId: "pet-1",
    zoneId: "orchard",
    tileX: 4,
    tileY: 5,
    facing: "down",
    mood: "curious",
    activity: "look_around",
    energy: 80,
    hunger: 20,
    hygiene: 90,
    bladder: 10,
    social: 60,
    stress: 15,
    lastSimulatedAt: now,
    actionEndsAt: "2026-06-28T00:00:20.000Z",
  },
  personality: {
    archetype: "shadow watcher",
    summary: "Alert and nosy.",
    curiosity: 88,
    sociability: 50,
    boldness: 48,
    treeAffinity: 80,
    zoomies: 45,
    napBias: 35,
  },
  bonds: [],
  memories: [],
  currentGoals: [],
  relationshipModels: [],
  ledgerFacts: [],
} satisfies GardenPetSnapshot;

describe("garden labels", () => {
  it("maps important activities and goals to readable labels", () => {
    expect(activityLabel("watch_fish")).toBe("watching fish");
    expect(activityLabel("seek_owner")).toBe("seeking owner");
    expect(goalLabel("seek_play")).toBe("looking for play");
  });

  it("groups activities into open-world visual tones", () => {
    expect(activityTone("reconcile")).toBe("social");
    expect(activityTone("scuffle")).toBe("conflict");
    expect(activityTone("sleep")).toBe("rest");
    expect(activityTone("look_around")).toBe("explore");
  });

  it("summarizes an autonomy decision when one exists", () => {
    const pet = {
      ...basePet,
      state: {
        ...basePet.state,
        lastAutonomyDecision: {
          goal: "explore",
          chosenActivity: "look_around",
          source: "fallback",
          reason: "Miso wants to scan the orchard before choosing a route.",
          decidedAt: now,
          candidates: [],
        },
      },
    } satisfies GardenPetSnapshot;

    expect(buildIntentSummary(pet)).toEqual({
      activity: "looking around",
      goal: "exploring",
      reason: "Miso wants to scan the orchard before choosing a route.",
      source: "fallback",
      tone: "explore",
    });
  });

  it("falls back to current state when no autonomy decision exists", () => {
    expect(buildIntentSummary(basePet)).toEqual({
      activity: "looking around",
      goal: "reading the room",
      reason: "Miso is curious and currently looking around.",
      source: "state",
      tone: "explore",
    });
  });

  it("selects the strongest visible relationship pulse", () => {
    const pet = {
      ...basePet,
      bonds: [
        {
          otherPetId: "pet-2",
          otherPetName: "Nyx",
          status: "friend",
          affinity: 56,
          rivalry: 4,
          updatedAt: now,
        },
        {
          otherPetId: "pet-3",
          otherPetName: "Patch",
          status: "enemy",
          affinity: 12,
          rivalry: 61,
          updatedAt: now,
        },
      ],
    } satisfies GardenPetSnapshot;

    expect(relationshipPulse(pet)).toEqual({
      label: "Patch",
      status: "enemy",
      detail: "affinity 12 / rivalry 61",
      tone: "conflict",
    });
  });
});
