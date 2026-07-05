import { describe, expect, it } from "vitest";

import {
  formatEncounterIntervention,
  formatEncounterStatus,
  formatEncounterWorldAction,
  ownerActionLabels,
} from "@/components/garden/encounter-thread-labels";
import type { GardenEncounter } from "@/lib/types";

const encounter: GardenEncounter = {
  id: "encounter-conflict-event-1",
  threadId: "thread:conflict:orchard:pet-ember:pet-patch",
  kind: "conflict",
  tone: "conflict",
  stage: "cooldown",
  status: "resolving",
  zoneId: "orchard",
  title: "Patch and Ember are tense",
  summary: "Patch and Ember squared off near the old tree.",
  participantPetIds: ["pet-patch", "pet-ember"],
  relatedEventIds: ["event-1"],
  suggestedOwnerActions: ["call", "pet", "scold"],
  lastIntervention: {
    ownerId: "profile-luna",
    petId: "pet-patch",
    action: "call",
    createdAt: "2026-06-28T10:02:00.000Z",
  },
  updatedAt: "2026-06-28T10:02:00.000Z",
};

describe("encounter thread labels", () => {
  it("formats visible thread status for encounter cards", () => {
    expect(formatEncounterStatus(encounter)).toEqual("Resolving");
    expect(formatEncounterStatus({ ...encounter, status: undefined })).toEqual("Active");
  });

  it("formats the last player intervention with the action label", () => {
    expect(formatEncounterIntervention(encounter)).toEqual("Last intervention: Call over");
    expect(ownerActionLabels.throw_toy).toEqual("Throw toy");
    expect(formatEncounterIntervention({ ...encounter, lastIntervention: undefined })).toBeNull();
  });

  it("formats the last world action separately from owner intervention", () => {
    expect(
      formatEncounterWorldAction({
        ...encounter,
        lastWorldAction: {
          viewerId: "profile-luna",
          action: "observe",
          createdAt: "2026-06-28T10:04:00.000Z",
        },
      }),
    ).toEqual("Last world action: Observed");
    expect(formatEncounterWorldAction(encounter)).toBeNull();
  });
});
