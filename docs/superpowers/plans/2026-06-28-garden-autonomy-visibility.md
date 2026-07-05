# Garden Autonomy Visibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/garden` feel more like a live pet open world by exposing each pet's intent, mood, relationships, recent activity, and world events in the main UI.

**Architecture:** Add a small pure presentation helper module for activity/goal/mood labels and intent summaries, then split the garden UI into focused components: a world status header, a selected pet autonomy HUD, and a compact narrative feed. Keep existing API/data flow and Pixi rendering intact.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, PixiJS, Vitest.

---

## File Structure

- Create: `components/garden/garden-labels.ts`
  - Pure label/category/summary helpers for `PetActivity`, `PetMood`, `PetAutonomyDecision`, and selected pet snapshots.
- Create: `components/garden/pet-autonomy-hud.tsx`
  - Selected pet side panel: identity, current intent, recent event, relationship pulse, needs, owner actions, report state.
- Modify: `components/garden/narrative-feed.tsx`
  - Convert large event cards into compact live world-feed rows while preserving click-to-select and social lines.
- Modify: `components/garden/garden-canvas.tsx`
  - Use readable activity labels and visual tone categories for pet labels/selection accents.
- Modify: `components/garden/garden-experience.tsx`
  - Recompose `/garden` into world header, main stage, selected pet HUD, compact feed, and existing chat drawer.
- Test: `test/garden-labels.test.ts`
  - Covers activity labels, intent tone categories, missing-decision fallback summaries, and relationship pulse selection.

## Task 1: Garden Presentation Helpers

**Files:**
- Create: `test/garden-labels.test.ts`
- Create: `components/garden/garden-labels.ts`

- [ ] **Step 1: Write failing tests**

Create `test/garden-labels.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  activityLabel,
  activityTone,
  buildIntentSummary,
  goalLabel,
  relationshipPulse,
} from "@/components/garden/garden-labels";
import type { GardenPetSnapshot } from "@/lib/types";

const basePet = {
  pet: {
    id: "pet-1",
    ownerId: "owner-1",
    activeGenerationId: "gen-1",
    name: "Miso",
    species: "cat",
    breed: "calico",
    bio: "watches everything",
    visibility: "public",
    isFrozen: false,
    createdAt: "2026-06-28T00:00:00.000Z",
    updatedAt: "2026-06-28T00:00:00.000Z",
  },
  generation: {
    id: "gen-1",
    petId: "pet-1",
    sourcePhotoId: "photo-1",
    status: "succeeded",
    avatarPath: "/generated/miso.svg",
    worldSpritePath: "/generated/miso.svg",
    createdAt: "2026-06-28T00:00:00.000Z",
    updatedAt: "2026-06-28T00:00:00.000Z",
  },
  owner: {
    id: "owner-1",
    email: "owner@example.com",
    handle: "owner",
    displayName: "Owner",
    bio: "",
    role: "user",
    createdAt: "2026-06-28T00:00:00.000Z",
    updatedAt: "2026-06-28T00:00:00.000Z",
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
    lastSimulatedAt: "2026-06-28T00:00:00.000Z",
    actionEndsAt: "2026-06-28T00:00:20.000Z",
  },
  personality: {
    archetype: "window hunter",
    summary: "Alert and nosy.",
    curiosity: 88,
    sociability: 50,
    boldness: 48,
    treeAffinity: 80,
    zoomies: 45,
    napBias: 35,
    chaos: 42,
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
          decidedAt: "2026-06-28T00:00:00.000Z",
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
        { otherPetId: "pet-2", otherPetName: "Nyx", status: "friend", affinity: 56, rivalry: 4 },
        { otherPetId: "pet-3", otherPetName: "Patch", status: "rival", affinity: 12, rivalry: 61 },
      ],
    } satisfies GardenPetSnapshot;

    expect(relationshipPulse(pet)).toEqual({
      label: "Patch",
      status: "rival",
      detail: "affinity 12 / rivalry 61",
      tone: "conflict",
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- test/garden-labels.test.ts`

Expected: FAIL because `components/garden/garden-labels.ts` does not exist.

- [ ] **Step 3: Implement helper module**

Create `components/garden/garden-labels.ts` with:

```ts
import type { GardenPetSnapshot, PetActivity, PetMood } from "@/lib/types";

export type ActivityTone = "social" | "conflict" | "rest" | "care" | "explore" | "neutral";

const activityLabels: Record<PetActivity, string> = {
  idle: "idling",
  wander: "wandering",
  sleep: "sleeping",
  eat: "eating",
  drink: "drinking",
  climb_tree: "climbing",
  hide: "hiding",
  poop: "pooping",
  chase: "chasing",
  scuffle: "scuffling",
  seek_owner: "seeking owner",
  play: "playing",
  look_around: "looking around",
  sunbathe: "sunbathing",
  watch_fish: "watching fish",
  groom: "grooming",
  dig: "digging",
  approach_pet: "approaching",
  observe_from_distance: "observing",
  claim_spot: "claiming spot",
  escort_owner: "escorting owner",
  offer_toy: "offering toy",
  reconcile: "reconciling",
  ignore: "ignoring",
  steal_spot: "stealing spot",
  move_to_zone: "moving zones",
};

const goalLabels: Record<string, string> = {
  explore: "exploring",
  seek_food: "looking for food",
  seek_rest: "looking for rest",
  seek_owner: "seeking owner",
  seek_play: "looking for play",
  avoid_threat: "seeking safety",
  guard_spot: "guarding a spot",
  socialize: "seeking company",
};

const moodLabels: Record<PetMood, string> = {
  happy: "happy",
  curious: "curious",
  playful: "playful",
  sleepy: "sleepy",
  lonely: "lonely",
  grumpy: "grumpy",
  dirty: "dirty",
};

export function activityLabel(activity: PetActivity) {
  return activityLabels[activity] ?? activity.replaceAll("_", " ");
}

export function goalLabel(goal?: string) {
  if (!goal) {
    return "reading the room";
  }

  return goalLabels[goal] ?? goal.replaceAll("_", " ");
}

export function moodLabel(mood: PetMood) {
  return moodLabels[mood] ?? mood;
}

export function activityTone(activity: PetActivity): ActivityTone {
  if (["play", "approach_pet", "offer_toy", "reconcile", "escort_owner", "seek_owner"].includes(activity)) {
    return "social";
  }

  if (["scuffle", "chase", "steal_spot", "ignore"].includes(activity)) {
    return "conflict";
  }

  if (["sleep", "sunbathe", "hide"].includes(activity)) {
    return "rest";
  }

  if (["eat", "drink", "groom", "poop"].includes(activity)) {
    return "care";
  }

  if (["wander", "look_around", "watch_fish", "climb_tree", "dig", "claim_spot", "observe_from_distance", "move_to_zone"].includes(activity)) {
    return "explore";
  }

  return "neutral";
}

export function buildIntentSummary(pet: GardenPetSnapshot) {
  const decision = pet.state.lastAutonomyDecision;
  const activity = decision?.chosenActivity ?? pet.state.activity;
  const tone = activityTone(activity);

  return {
    activity: activityLabel(activity),
    goal: goalLabel(decision?.goal),
    reason:
      decision?.reason ??
      `${pet.pet.name} is ${moodLabel(pet.state.mood)} and currently ${activityLabel(pet.state.activity)}.`,
    source: decision?.source ?? "state",
    tone,
  };
}

export function relationshipPulse(pet: GardenPetSnapshot) {
  const strongestBond = [...pet.bonds].sort(
    (left, right) =>
      Math.max(right.affinity, right.rivalry) - Math.max(left.affinity, left.rivalry),
  )[0];

  if (strongestBond) {
    return {
      label: strongestBond.otherPetName,
      status: strongestBond.status,
      detail: `affinity ${strongestBond.affinity} / rivalry ${strongestBond.rivalry}`,
      tone: strongestBond.rivalry > strongestBond.affinity ? "conflict" : "social",
    } as const;
  }

  const model = pet.relationshipModels[0];

  if (model) {
    return {
      label: model.targetPetName,
      status: model.attachmentPattern,
      detail: `trust ${model.trust} / resentment ${model.resentment}`,
      tone: model.resentment > model.trust ? "conflict" : "social",
    } as const;
  }

  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- test/garden-labels.test.ts`

Expected: PASS.

## Task 2: Selected Pet Autonomy HUD

**Files:**
- Create: `components/garden/pet-autonomy-hud.tsx`
- Modify: `components/forms/cyber-forms.tsx` only if grouping existing owner actions inside the current component is cleaner.

- [ ] **Step 1: Build the component around existing data**

Create `PetAutonomyHud` with props:

```ts
type PetAutonomyHudProps = {
  pet: GardenPetSnapshot | null;
  viewer: Profile | null;
  onChat: () => void;
  onRefresh: () => void;
};
```

It must render:

- empty selection prompt when `pet` is null
- identity row
- current intent section from `buildIntentSummary`
- recent event section
- relationship pulse section from `relationshipPulse`
- needs meters
- existing `OwnerActionButtons` when viewer owns the pet
- existing `ReportForm` when viewer does not own the pet

- [ ] **Step 2: Keep component behavior minimal**

Do not add new API calls. Use `OwnerActionButtons`, `ReportForm`, and parent callbacks.

- [ ] **Step 3: Run type/lint feedback after creation**

Run: `npm run lint`

Expected: component imports and JSX pass lint.

## Task 3: Compact World Feed

**Files:**
- Modify: `components/garden/narrative-feed.tsx`

- [ ] **Step 1: Refactor markup only**

Keep props unchanged. Convert each event from a large `Card` into a compact row:

- primary pet sprite
- related pet sprite if any
- event type and mood glyph
- relative time
- body
- social lines as small chips

- [ ] **Step 2: Preserve interactions**

Clicking the row selects the primary pet. Clicking a related pet selects the related pet. Stop propagation on sprite buttons.

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: PASS or only actionable issues introduced by this task.

## Task 4: Garden Main Layout

**Files:**
- Modify: `components/garden/garden-experience.tsx`

- [ ] **Step 1: Replace mixed card layout with world HUD composition**

Use these regions:

- world header: zone, description, garden time, transport state, pet/object counts, zone tabs
- main stage: `GardenCanvas`, switching status, movement error
- compact feed: `NarrativeFeed`
- selected pet HUD: `PetAutonomyHud`

- [ ] **Step 2: Preserve behavior**

Keep these existing functions and flows:

- `switchZone`
- `handlePetSelection`
- `refreshCurrentZone`
- `handleCanvasInteraction`
- `ChatDrawer`

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: PASS or only actionable issues introduced by this task.

## Task 5: Canvas State Visibility

**Files:**
- Modify: `components/garden/garden-canvas.tsx`

- [ ] **Step 1: Import presentation helpers**

Use `activityLabel` and `activityTone`.

- [ ] **Step 2: Improve selected and activity labels**

Where pet name/activity labels are drawn, replace raw enum labels with `activityLabel(activity)`. Use `activityTone(activity)` to select label accent colors for social/conflict/rest/explore/care.

- [ ] **Step 3: Avoid high-density clutter**

Keep non-selected labels compact. Emphasize selected pet, active social/conflict pets, and pets with current bubbles.

- [ ] **Step 4: Run lint and tests**

Run:

```bash
npm run lint
npm run test
```

Expected: PASS.

## Task 6: Rendered Browser Verification

**Files:**
- No production files unless validation finds defects.

- [ ] **Step 1: Start or reuse a dev server**

Use an available local port. Prefer existing `3101` or `3102` if still running; otherwise start:

```bash
npm run dev -- -p 3101
```

- [ ] **Step 2: Browser checks**

Flow under test: `/garden` loads -> select a pet -> selected pet HUD updates -> world feed event click selects a pet -> mobile viewport has no obvious overlap.

Required checks:

- page identity
- not blank
- no Next.js framework overlay
- console health
- screenshot evidence
- interaction proof

- [ ] **Step 3: Fix visible defects and rerun relevant checks**

If text overlaps, controls are hidden, or interaction breaks, patch the smallest component and rerun lint plus the browser check.

## Task 7: Final Verification

**Files:**
- No production files unless validation finds defects.

- [ ] **Step 1: Run full verification**

Run:

```bash
npm run lint
npm run test
```

- [ ] **Step 2: Report exactly what was verified**

Mention:

- files changed
- tests run and result
- browser route and viewport checked
- any remaining risk

