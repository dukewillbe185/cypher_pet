import { describe, expect, it } from "vitest";

import {
  buildProjectedRouteConsequence,
  buildWorldActionFeedback,
} from "@/components/garden/world-action-feedback";

describe("world action feedback", () => {
  it("turns a successful pet command into a visible receipt", () => {
    expect(
      buildWorldActionFeedback({
        petId: "pet-nyx",
        zoneId: "orchard",
        previousZoneId: "pond",
        activity: "approach_pet",
        summary: "Luna 提到了 Patch，Nyx 便朝它所在的方向靠了过去。",
      }),
    ).toEqual({
      title: "World action recorded",
      body: "Luna 提到了 Patch，Nyx 便朝它所在的方向靠了过去。",
      meta: "approach pet · pond -> orchard",
      petId: "pet-nyx",
      zoneId: "orchard",
    });
  });

  it("uses a steady-zone meta label when no zone transition happened", () => {
    expect(
      buildWorldActionFeedback({
        petId: "pet-biscuit",
        zoneId: "orchard",
        previousZoneId: "orchard",
        activity: "wander",
        summary: "Biscuit moved to the next tile.",
      }).meta,
    ).toBe("wander · orchard");
  });

  it("describes the projected consequence for a route action before execution", () => {
    expect(
      buildProjectedRouteConsequence({
        actorName: "Nyx",
        targetLabel: "Patch",
        routeLabel: "approaching Patch",
        commandLabel: "Guide Nyx to Patch",
        disabledReason: null,
      }),
    ).toBe("Guide Nyx to Patch will turn approaching Patch into a world action involving Patch.");
  });

  it("keeps projected consequences useful when the route is read-only", () => {
    expect(
      buildProjectedRouteConsequence({
        actorName: "Biscuit",
        targetLabel: "next tile",
        routeLabel: "looking around route",
        commandLabel: "Enter Garden",
        disabledReason: "Enter Garden to act on this route.",
      }),
    ).toBe("Biscuit is on looking around route toward next tile. Enter Garden to act on this route.");
  });
});
