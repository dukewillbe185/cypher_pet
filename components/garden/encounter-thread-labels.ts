import type {
  GardenEncounter,
  GardenEncounterThreadStatus,
  GardenEncounterWorldAction,
  OwnerAction,
} from "@/lib/types";

export const ownerActionLabels: Record<OwnerAction, string> = {
  feed: "Feed",
  pet: "Comfort",
  throw_toy: "Throw toy",
  clean_poop: "Clean",
  call: "Call over",
  scold: "Interrupt",
  gift: "Gift",
  photo: "Photo",
  rename_spot: "Name spot",
};

const encounterStatusLabels: Record<GardenEncounterThreadStatus, string> = {
  active: "Active",
  resolving: "Resolving",
  resolved: "Resolved",
  expired: "Expired",
};

export const encounterWorldActionLabels: Record<GardenEncounterWorldAction, string> = {
  observe: "Observed",
  approach: "Approached",
};

export function formatEncounterStatus(encounter: Pick<GardenEncounter, "status">) {
  return encounterStatusLabels[encounter.status ?? "active"];
}

export function formatEncounterIntervention(
  encounter: Pick<GardenEncounter, "lastIntervention">,
) {
  if (!encounter.lastIntervention) {
    return null;
  }

  return `Last intervention: ${ownerActionLabels[encounter.lastIntervention.action]}`;
}

export function formatEncounterWorldAction(
  encounter: Pick<GardenEncounter, "lastWorldAction">,
) {
  if (!encounter.lastWorldAction) {
    return null;
  }

  return `Last world action: ${encounterWorldActionLabels[encounter.lastWorldAction.action]}`;
}
