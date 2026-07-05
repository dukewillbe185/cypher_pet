import { describe, expect, it } from "vitest";

import { buildPetEpisodicMemoryIndex, buildSemanticMemoryDigest } from "@/lib/ai/memory-compressor";
import { listGardenFactsForPet } from "@/lib/domain/garden-memory";
import { ensurePetGoals } from "@/lib/domain/goals";
import { rememberPet, upsertRelationship } from "@/lib/domain/social";
import { getPairRelationshipModel } from "@/lib/domain/social-model";
import { seedStore } from "@/lib/mock/seed";
import type { AppStore } from "@/lib/types";

function cloneStore() {
  return structuredClone(seedStore) as AppStore;
}

describe("autonomy scenarios", () => {
  it("turns social memories into retrievable episodic and semantic memory", () => {
    const store = cloneStore();
    const nowIso = "2026-03-15T00:00:00.000Z";

    rememberPet(store, {
      petId: "pet-patch",
      kind: "friend_pet",
      relatedPetId: "pet-ember",
      zoneId: "orchard",
      body: "Patch 还是会把 Ember 记成果树区最顺耳的那道脚步声。",
      weight: 82,
      nowIso,
    });

    const pet = store.pets.find((entry) => entry.id === "pet-patch")!;
    const episodic = buildPetEpisodicMemoryIndex(store, pet);
    const semantic = buildSemanticMemoryDigest(store, pet, nowIso);
    const facts = listGardenFactsForPet(store, pet.id, 8);

    expect(episodic.people.some((entry) => entry.includes("Ember"))).toBe(true);
    expect(semantic.socialJudgments.join(" ")).toContain("Ember");
    expect(facts.some((fact) => fact.objectLabel === "Ember" && fact.predicate === "likes")).toBe(true);
  });

  it("keeps pair relationship continuity after rivalry updates", () => {
    const store = cloneStore();
    const nowIso = "2026-03-15T01:00:00.000Z";

    upsertRelationship(store, "pet-glitch", "pet-unit7", {
      affinityDelta: -10,
      rivalryDelta: 34,
      nowIso,
    });

    const model = getPairRelationshipModel(store, "pet-glitch", "pet-unit7");
    expect(model).toBeTruthy();
    expect(model?.resentment).toBeGreaterThanOrEqual(34);
    expect(model?.attachmentPattern).toBeTruthy();
  });

  it("creates mid-term goals from owner need and preferred zone facts", () => {
    const store = cloneStore();
    const pet = store.pets.find((entry) => entry.id === "pet-patch")!;
    const state = store.petStates.find((entry) => entry.petId === pet.id)!;
    const nowIso = "2026-03-15T02:00:00.000Z";

    state.social = 22;
    state.energy = 64;
    state.hunger = 28;

    const goals = ensurePetGoals(store, pet, state, nowIso);
    const goalTypes = goals.map((goal) => goal.goalType);

    expect(goalTypes).toContain("seek_reassurance_from_owner");
    expect(goalTypes.some((goalType) => goalType === "guard_favorite_spot" || goalType === "explore_zone")).toBe(true);
    expect(state.activeGoals?.length).toBeGreaterThan(0);
  });
});
